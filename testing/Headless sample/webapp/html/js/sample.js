(function (customUI, common) {

    let currentRole = {}
    let bpmApp = {
        bpdId: '25.9fce27c5-542b-4948-885c-72613733cfbc',
        branchId: '2063.0ca07eaf-244e-4b9f-997a-dbe5275dc2f3',
        acronym: 'TS',
        bpdName: 'HR Open New Position'
    }

    let showLoading = function () {
        $('#loading-div').show()
        $('#main').hide()
    }
    let hideLoading = function () {
        $('#loading-div').hide()
        $('#main').show()
    }
    let loginAs = function (username) {
        // show loading
        showLoading()
        // login user with api
        $.post(`${common.root}ProcessPortal/j_security_check?j_username=${username}&j_password=123456`).done(() => {
            // update the task list
            loadTasks()
        })
    }
    let newTaskRow = function (task) {
        let result = $('<tr></tr>')
        result.append(`<td>${task['TASK.TKIID']}</td>`)
        result.append(`<td>${task.TAD_DISPLAY_NAME}</td>`)
        result.append(`<td>${task.PI_NAME}</td>`)
        result.append(`<td>${task.DUE}</td>`)
        let bpmBtn = $('<button type="button" class="btn btn-link">BPM UI</button>')
        bpmBtn.on('click', {
            task
        }, function (event) {
            showInIframe(event.data.task)
        })
        let customBtn = $('<button type="button" class="btn btn-link">Custom UI</button>')
        customBtn.on('click', {
            task
        }, function (event) {
            showInCustom(event.data.task)
        })
        $('<td></td>').append(bpmBtn, customBtn).appendTo(result)
        return result
    }
    let loadTasks = function () {
        $.ajax({
            url: `${common.root}rest/bpm/wle/v1/tasks`,
            type: 'PUT',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                organization: "byTask",
                shared: false,
                teams: [],
                sort: [{
                    field: "taskDueDate",
                    order: "ASC"
                }],
                conditions: [{
                    field: "instanceProcessApp",
                    operator: "Equals",
                    value: bpmApp.acronym
                }, {
                    field: "bpdName",
                    operator: "Equals",
                    value: bpmApp.bpdName
                }],
                fields: [
                    "taskSubject",
                    "instanceName",
                    "taskStatus",
                    "taskDueDate",
                    "assignedToUser"
                ],
                aliases: [],
                interaction: "claimed_and_available",
                size: 25
            })
        }).done(data => {
            let tbody = $('#task-table > table > tbody')
            tbody.empty()
            if (data.data.items && data.data.items.length > 0) {
                data.data.items.forEach(task => {
                    tbody.append(newTaskRow(task))
                });
                $('.badge').text(data.data.items.length)
            } else {
                $('.badge').text(0)
            }
            $('#task-table').show()
            $('#bpm-ui').hide()
            $('#custom-ui').hide()
            // end loading
            hideLoading()
        })
    }
    let newRequest = function () {
        // show loading
        showLoading()
        // submit new request
        $.post(`${common.root}rest/bpm/wle/v1/process?action=start&bpdId=${bpmApp.bpdId}&branchId=${bpmApp.branchId}&parts=header%7CexcludeTaskData%7CexcludeDocs`).done((data) => {
            console.log(data)
            // show task list
            loadTasks()
        })
    }
    let showInIframe = function (task) {
        // hide task list
        $('#task-table').hide()
        // show iframe div
        $('#bpm-ui').show()
        $('#bpm-ui > iframe').attr('src', `${common.root}teamworks/process.lsw?zWorkflowState=1&zTaskId=${task['TASK.TKIID']}&zResetContext=true`)
    }
    let showInCustom = function (task) {
        // hide task lis
        $('#task-table').hide()
        // show custom ui
        $('#custom-ui').show()
        customUI.showTask(task, currentRole)
    }
    let showTasks = function () {
        showLoading()
        loadTasks()
    }

    let showMainPage = function () {
        $('.well').hide()
        $('.container-fluid').show()
    }
    // binding event
    $('document').ready(function () {
        $('#run-as-menu > li > a').on('click', function (event) {
            $('#current-role').text($(this).text())
            let roleName = $(this).data('role')
            if (roleName === 'hiringManager') {
                $('#new-request-button').show()
            } else {
                $('#new-request-button').hide()
            }
            currentRole = common.roles[roleName]
            loginAs(currentRole.defaultUser)
            showMainPage()
        })
        $('#new-request-button').on('click', function () {
            newRequest()
        })
        $('#inbox-button').on('click', function () {
            showTasks()
        })
        customUI.setup()
        $(`#${customUI.customEvents.requestSubmitted.element}`).on(`${customUI.customEvents.requestSubmitted.name}`, function () {
            showTasks()
        })
        $(`#${customUI.customEvents.approvalSubmitted.element}`).on(`${customUI.customEvents.approvalSubmitted.name}`, function () {
            showTasks()
        })
        $(`#${customUI.customEvents.candidatesSubmitted.element}`).on(`${customUI.customEvents.candidatesSubmitted.name}`, function () {
            showTasks()
        })
        // for testing
        // showMainPage()
        // $('#task-table').hide()
        // $('#custom-ui').show()
        // customUI.showTask({
        //     OWNER: 'david',
        //     'TASK.TKIID': "17490"
        // }, common.roles.hiringManager)
    })
})(customUI, common)