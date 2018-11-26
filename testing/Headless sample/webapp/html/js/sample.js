(function () {
    const server = '9.30.160.68'
    const port = 9444
    const requestor = 'requestor'
    const reviewer = 'reviewer'
    // let root = 'https://9.30.160.68:9444/'
    let root = '/'

    let showLoading = function () {
        $('#loading-div').show()
        $('#main').hide()
    }
    let hideLoading = function () {
        $('#loading-div').hide()
        $('#main').show()
    }
    let loginAs = function (username) {
        currentUser = username
        // show loading
        showLoading()
        // update available menu
        $('#current-user').text(username)
        if (username === 'requestor') {
            $('#new-request-button').show()
        } else {
            $('#new-request-button').hide()
        }
        // login user with api
        $.post(`${root}ProcessPortal/j_security_check?j_username=${username}&j_password=123456`).done(() => {
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
            url: `${root}rest/bpm/wle/v1/tasks`,
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
                    value: "HEADLES"
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
        $.post(`${root}rest/bpm/wle/v1/process?action=start&bpdId=25.ec1b8876-0056-4c4b-a8e0-4115831c3ba2&branchId=2063.c1225bd2-171c-4347-bdb6-33264dd43c1f&parts=header%7CexcludeTaskData%7CexcludeDocs`).done((data) => {
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
        $('#bpm-ui > iframe').attr('src', `${root}teamworks/process.lsw?zWorkflowState=1&zTaskId=${task['TASK.TKIID']}&zResetContext=true`)
    }
    let showInCustom = function (task) {
        // hide task lis
        $('#task-table').hide()
        // show custom ui
        $('#custom-ui').show()
        if (task.TAD_DISPLAY_NAME === 'Step: Order Request') {
            customuiForRequestor(task)
        } else {
            customuiForReviewer(task)
        }
    }
    let customuiForReviewer = function (task) {
        let taskId = task['TASK.TKIID']
        $('#reject').data('taskId', taskId)
        $('#approve').data('taskId', taskId)
        $(`#for-${requestor}`).hide()
        if (!task.OWNER) {
            $.ajax({
                url: `${root}rest/bpm/wle/v1/task?action=claim&taskIDs=${taskId}`,
                type: 'PUT'
            }).done(() => {
                updateForReviewer(taskId)
            })
        } else {
            updateForReviewer(taskId)
        }
    }
    let updateForReviewer = function (taskId) {
        $.get(`${root}rest/bpm/wle/v1/task/${
    taskId
  }?action=getData&fields=amount%2Ctype`).done(data => {
            $('#for-reviewer > div:nth-child(1) > p').text(data.data.resultMap.type)
            $('#for-reviewer > div:nth-child(2) > p').text(data.data.resultMap.amount)
            $('#comments').val('')
            $(`#for-${reviewer}`).show()
        })
    }
    let customuiForRequestor = function (task) {
        $(`#for-${reviewer}`).hide()
        let taskId = task['TASK.TKIID']
        $('#submit').data('taskId', taskId)
        $.get(`${root}rest/bpm/wle/v1/task/${
    taskId
  }?action=getData&fields=amount%2Ctype%2Cmessage`).done(data => {
            if (data.data.resultMap.type) {
                $('#request-type').val(data.data.resultMap.type)
            }
            $('#amount').val(data.data.resultMap.amount)
            $('#for-requestor > div:nth-child(3) > p').text(data.data.resultMap.message)
            $(`#for-${requestor}`).show()
        })
    }
    let submitRequest = function () {
        let taskId = $('#submit').data('taskId')
        let type = $('#request-type').val()
        let amount = $('#amount').val()
        $.ajax({
            url: `${root}rest/bpm/wle/v1/task/${taskId}/?action=finish&parts=all&params=${encodeURI(
                JSON.stringify({
                    amount,
                    type
                })
              )}`,
            type: 'PUT'
        }).done(() => {
            showTasks()
        })
    }
    let reject = function () {
        let taskId = $('#reject').data('taskId')
        let comment = $('#comments').val()
        let approved = false
        $.ajax({
            url: `${root}rest/bpm/wle/v1/task/${taskId}/?action=finish&parts=all&params=${encodeURI(
                JSON.stringify({
                    comment,
                    approved
                })
              )}`,
            type: 'PUT'
        }).done(() => {
            showTasks()
        })
    }
    let approve = function () {
        let comment = $('#comments').val()
        let approved = true
        let taskId = $('#approve').data('taskId')
        $.ajax({
            url: `${root}rest/bpm/wle/v1/task/${taskId}/?action=finish&parts=all&params=${encodeURI(
                JSON.stringify({
                    comment,
                    approved
                })
              )}`,
            type: 'PUT'
        }).done(() => {
            showTasks()
        })
    }
    let showTasks = function () {
        showLoading()
        loadTasks()
    }

    // binding event
    $('#requestor-menu').on('click', function () {
        loginAs(requestor)
    })
    $('#reviewer-menu').on('click', function () {
        loginAs(reviewer)
    })
    $('#new-request-button').on('click', function () {
        newRequest()
    })
    $('#inbox-button').on('click', function () {
        showTasks()
    })
    $('#submit').on('click', function () {
        submitRequest()
    })
    $('#reject').on('click', function () {
        reject()
    })
    $('#approve').on('click', function () {
        approve()
    })
})()