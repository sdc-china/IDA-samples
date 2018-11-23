// define function
// attach event
// run initial code?

// let apis = {
//     login(username){},
//     claimTask(taskId){},
//     newRequest(){},
//     getTasks(){
//     },
//     getData(taskId){},
//     completeTask(taskId, params){}
// },
(function(){
    let loginAs = function(username){
        $('#current-user').text(username)
        $('#loading-div').show()
        if(username === 'requestor'){
        $('#new-request-button').show()
    }else{
        $('#new-request-button').hide()
    }
        // show loading
        // login user with api
        // update the task list
        // update available menu
        // end loading
        $('#loading-div').hide()
    }
    let newRequest = function(){
        // show loading
        // submit new request
        // show task list
        // end load
    }
    let showInIframe = function(taskId){
        // hide task list
        // show iframe div
    }
    let showInCustom = function(taskId){
        // hide task list
        // show custom ui
    }
    let showTasks = function(){
        // show loading div
        // empty exiting task table
        // reload task table
        // hide loading div
    }

    // binding event
    $('#requestor-menu').on('click',function(){
        loginAs('requestor')
    })
    $('#reviewer-menu').on('click',function(){
        loginAs('reviewer')
    })
    $('#new-request-button').on('click', function(){
        newRequest()
    })
    $('#inbox-button').on('click', function(){
        showTasks()
    })
})()