let customUI = (function (common) {
    let customEvents = {
        requestSubmitted: {
            name: 'requestSubmitted',
            element: 'submitRequest'
        },
        approvalSubmitted: {
            name: 'approvalSubmitted',
            element: 'submitApproval'
        },
        candidatesSubmitted: {
            name: 'candidatesSubmitted',
            element: 'submitCandidates'
        }
    }
    const employmentTypes = ['Contract', 'Full-time', 'Part-time']
    const departments = ['Finance', 'Marketing', 'Product Development', 'Human Resources',
        'Sales', 'Customer Service', 'Business Partner Service', 'Business Strategies', 'Software Engineering'
    ]
    const locationList = ['Atlanta', 'Boston', 'Chicago', 'Cincinati', 'Dallas', 'Denver', 'Des Moines']
    const eductionList = ['Bachelor of Science (BS)', 'Bachelor of Arts (BA)', 'Bachelor of Engineering (B.Eng)', 'Bachelor of Architecture (B.Arch)',
        'Master of Business Administration (MBA)', 'Master of Science in Mathematics (MMath)', 'Master of Science in Information Technology (MSc.IT)'
    ]
    const experienceList = ['No prior experience',
        '1-2 years experience', '3-4 years experience', '5-10 years experience', '10+ years experience'
    ]
    const skillList = ['Programming', 'Design Patterns', 'Data Structures', 'Algorithms', 'Version Control', 'Quality Assurance',
        'Graphic Design', 'Analysis', 'Project Management', 'Customer Service'
    ]
    const candidates = [{
            name: "Bob Smith",
            qualifications: {
                education: ["Bachelor of Arts (BA)"],
                skills: ["Customer Service"],
                experience: "3-4 years experience"
            }
        },
        {
            name: "Monica Tribiani",
            qualifications: {
                education: ["Bachelor of Arts (BA)", "Master of Business Administration (MBA)"],
                skills: ["Project Management", "Customer Service"],
                experience: "10+ years experience"
            }
        },
        {
            name: "Emma Doe",
            qualifications: {
                education: ["Bachelor of Engineering (B.Eng)", "Master of Science in Information Technology (MSc. IT)"],
                skills: ["Quality Assurance", "Programming"],
                experience: "1-2 years experience"
            }
        },
        {
            name: "Chandler Green",
            qualifications: {
                education: ["Bachelor of Science (BS)", "Master of Science in Mathematics (MMath)"],
                skills: ["Analysis"],
                experience: "5-10 years experience"
            }
        },
        {
            name: "Moe Bryant",
            qualifications: {
                education: ["Bachelor of Architecture (B.Arch)", "Master of Business Administration (MBA)"],
                skills: ["Programming"],
                experience: "No prior experience"
            }
        },
        {
            name: "Joey Phalange",
            qualifications: {
                education: ["Bachelor of Arts (BA)"],
                skills: ["Customer Service"],
                experience: "3-4 years experience"
            }
        },
        {
            name: "Courtney Adams",
            qualifications: {
                education: ["Bachelor of Arts (BA)", "Master of Business Administration (MBA)"],
                skills: ["Quality Assurance"],
                experience: "3-4 years experience"
            }
        },
        {
            name: "Jim Torvalds",
            qualifications: {
                education: ["Bachelor of Engineering (B.Eng)", "Master of Science in Mathematics (MMath)"],
                skills: ["Programming", "Data Structures", "Algorithms", "Analysis"],
                experience: "5-10 years experience"
            }
        },
        {
            name: "Billy Mars",
            qualifications: {
                education: ["Bachelor of Architecture (B.Arch)"],
                skills: ["Programming"],
                experience: "1-2 years experience"
            }
        },
        {
            name: "Regina Bing",
            qualifications: {
                education: ["Bachelor of Science (BS)", "Master of Science in Mathematics (MMath)"],
                skills: ["Analysis", "Programming", "Algorithms"],
                experience: "10+ years experience"
            }
        }
    ]
    let setup = function () {
        setupUiForGeneralManager()
        setupUiForHiringManager()
        setupUiForHumanResource()
    }
    let showTask = function (task, role) {
        let taskId = task['TASK.TKIID']
        if (!task.OWNER) {
            claimTask(taskId, role)
        } else {
            updateTaskUi(taskId, role)
        }
    }
    let claimTask = function (taskId, role) {
        $.ajax({
            url: `${common.root}rest/bpm/wle/v1/task?action=claim&taskIDs=${taskId}`,
            type: 'PUT'
        }).done(() => {
            updateTaskUi(taskId, role)
        })
    }
    let taskUiForGeneralManager = function (taskId) {
        $('#hiring-request-panel').show()
        $('#submitRequest').hide()
        $('#findCandidatesBtn').hide()
        $('#approvePanel').show()
        $('#submitApproval').data('taskId', taskId)
        $('#hiring-request-panel input').prop('disabled', true)
        $('#hiring-request-panel select').prop('disabled', true)
        $.get(`${common.root}rest/bpm/wle/v1/task/${
            taskId
          }?action=getData&fields=currentPosition%2Crequisition`).done(data => {
            let result = data.data.resultMap
            if (result.currentPosition) {
                updateUiWitCurrentPosition(result.currentPosition)
            }
            if (result.requisition) {
                updateUiWithRequisition(result.requisition)
            }
        })
    }
    let populateQualificationTable = function (qualification) {
        let result = $('<table>', {
            class: 'table'
        })
        let head = $('<thead>')
        let body = $('<tbody>')
        $('<tr>').append('<th>education</th>', '<th>skills</th>', '<th>experience</th>').appendTo(head)
        $('<tr>').append(
            `<td>${qualification.education}</td>`,
            `<td>${qualification.skills}</td>`,
            `<td>${qualification.experience}</td>`).appendTo(body)
        result.append(head, body)
        return result
    }
    let taskUiForHumanResource = function (taskId) {
        // load current position
        // updateUiWitCurrentPosition()
        $('#hiring-request-panel').show()
        $('#hiring-request-panel input').prop('disabled', true)
        $('#hiring-request-panel select').prop('disabled', true)
        $('#submitRequest').hide()
        $('#approvePanel').hide()
        $('#findCandidatesBtn').show()
        $('#submitCandidates').data('taskId', taskId)
        $('#candidates').empty()
        candidates.forEach(candidate => {
            let item = $('<li>').addClass('list-group-item').text(candidate.name)
            item.addClass(candidate.name)
            let removeBtn = $('<span>').addClass('glyphicon glyphicon-remove-sign pull-right')
            removeBtn.on('click', function () {
                $(this).parent().remove()
            })
            item.append(removeBtn, populateQualificationTable(candidate.qualifications))
            $('#candidates').append(item)
        })
        $.get(`${common.root}rest/bpm/wle/v1/task/${
            taskId
          }?action=getData&fields=currentPosition`).done(data => {
            let result = data.data.resultMap
            if (result.currentPosition) {
                updateUiWitCurrentPosition(result.currentPosition)
            }
        })
    }
    let taskUiForHiringManager = function (taskId) {
        $('#hiring-request-panel').show()
        $('#hiring-request-panel input').prop('disabled', false)
        $('#hiring-request-panel select').prop('disabled', false)
        $('#submitRequest').show()
        $('#submitRequest').data('taskId', taskId)
        $('#approvePanel').hide()
        $('#findCandidatesBtn').hide()
    }

    let updateTaskUi = function (taskId, role) {
        // based on current role show different ui
        $('#custom-ui > div').hide()
        // 
        if (role === common.roles.generalManager) {
            taskUiForGeneralManager(taskId)
        } else if (role === common.roles.humanResource) {
            taskUiForHumanResource(taskId)
        } else {
            taskUiForHiringManager(taskId)
        }
    }
    let buildRatioOption = function (value) {
        let result = $('<div>', {
            class: 'radio'
        })
        $('<label>').append(
            $('<input>', {
                type: 'radio',
                name: 'radioOptions',
                value
            })
        ).appendTo(result).append(value)
        return result
    }
    let setupUiForHiringManager = function () {
        employmentTypes.forEach(item => $('#employment-type').append(new Option(item, item)))
        departments.forEach(item => $('#department').append(new Option(item, item)))
        locationList.forEach(item => $('#location').append(new Option(item, item)))
        eductionList.forEach(item => $('#education').append(new Option(item, item)))
        skillList.forEach(item => $('#skills').append(new Option(item, item)))
        experienceList.forEach(item => $('#experience').append(buildRatioOption(item, item)))
        let startDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
        $('#date').val(startDate.toISOString().substring(0, 10))
        $('#submitRequest').on('click', function () {
            /// submit request data
            let result = {
                requisition: readRequisitionFromUi(),
                currentPosition: readCurrentPositionFromUi()
            }
            let taskId = $('#submitRequest').data('taskId')
            $.ajax({
                url: `${common.root}rest/bpm/wle/v1/task/${taskId}?action=finish&parts=none&params=${JSON.stringify(result)}`,
                type: 'PUT'
            }).done(response => {
                console.log(response)
                $('#submitRequest').trigger(customEvents.requestSubmitted.name)
            })
        })
    }

    let setupUiForGeneralManager = function () {
        $('#submitApproval').on('click', function () {
            // submit approval data
            let result = {
                requisition: readRequisitionFromUi()
            }
            let taskId = $('#submitApproval').data('taskId')
            result.requisition.gmApproval = $('#approvePanel input[value=approved]').is(':checked')
            result.requisition.gmComments = $('#gmComments').val()
            $.ajax({
                url: `${common.root}rest/bpm/wle/v1/task/${taskId}?action=finish&parts=none&params=${JSON.stringify(result)}`,
                type: 'PUT'
            }).done(response => {
                console.log(response)
                $('#submitApproval').trigger(customEvents.approvalSubmitted.name)
            })
        })
    }
    let setupUiForHumanResource = function () {
        // submit candidates
        $('#submitCandidates').on('click', function () {
            let taskId = $('#submitCandidates').data('taskId')
            let result = {
                candidates: []
            }
            candidates.forEach(candidate => {
                let classSelector = candidate.name.replace(' ', '.')
                if ($(`#candidates li.${classSelector}`).length > 0) {
                    result.candidates.push(candidate)
                }
            })
            $.ajax({
                url: `${common.root}rest/bpm/wle/v1/task/${taskId}?action=finish&parts=none&params=${JSON.stringify(result)}`,
                type: 'PUT'
            }).done(response => {
                console.log(response)
                $('#submitCandidates').trigger(customEvents.candidatesSubmitted.name)
                $('#myModal').modal('hide')
            })
        })
    }
    let readCurrentPositionFromUi = function () {
        let result = {
            iId: '',
            positionType: 'New',
            jobTitle: '',
            qualifications: {
                education: [],
                skills: [],
                experience: ''
            },
            replacement: {
                firstName: 'Bob',
                lastName: 'Smith',
                notes: '',
                payLevel: '8',
                payType: 'Exempt',
                startDate: null,
                supervisor: 'Ann Fisher'
            }
        }
        result.jobTitle = $('#title').val()
        result.qualifications.experience = $('#experience > div > label > input[name=radioOptions]:checked').val()
        result.qualifications.skills = $('#skills').val()
        result.qualifications.education = $('#education').val()
        return result
    }
    let readRequisitionFromUi = function () {
        let result = {
            approvalNeeded: false,
            date: '',
            department: '',
            empNum: 1,
            empType: '',
            gmApproval: false,
            gmComments: '',
            instanceId: '',
            location: '',
            reqNum: '',
            requester: ''
        }
        result.empType = $('#employment-type').val()
        result.department = $('#department').val()
        result.requester = $('#hiringManagerInput').val()
        result.location = $('#location').val()
        result.empNum = $('#numberOfEmployee').val()
        result.date = $('#date').val()
        return result
    }
    let updateUiWitCurrentPosition = function (currentPosition) {
        $('#title').val(currentPosition.jobTitle)
        $(`#experience > div > label > input[value='${currentPosition.experience}']`).prop('checked', true);
        $('#skills').val(currentPosition.qualifications.skills.items)
        $('#education').val(currentPosition.qualifications.education.items)
    }
    let updateUiWithRequisition = function (requisition) {
        $('#employment-type').val(requisition.empType)
        $('#department').val(requisition.department)
        $('#hiringManagerInput').val(requisition.requester)
        $('#location').val(requisition.location)
        $('#numberOfEmployee').val(requisition.empNum)
        $('#date').val(requisition.date.substring(0, 10))
    }
    return {
        customEvents,
        setup,
        showTask
    }
})(common)