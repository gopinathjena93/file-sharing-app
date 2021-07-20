const baseUrl = "http://localhost:3000/";
const maxAllowedSize = 100 * 1024 * 1024;

const dropZone = document.querySelector(".drop-zone");
const sharingContainer = document.querySelector(".sharing-container");
const fileURL = document.querySelector("#fileURL");
const copyURLBtn = document.querySelector("#copyURLBtn");
const bgProgress = document.querySelector(".bg-progress");
const progressPercent = document.querySelector("#progressPercent");
const progressBar = document.querySelector(".progress-bar");
const progressContainer = document.querySelector(".progress-container");

//https://send.creativeshi.com/

function selectFile() {
    $("#fileInput").click();
}

$("#fileInput").change(function () {
    uploadFile();
});


dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length === 1) {
        if (files[0].size < maxAllowedSize) {
            fileInput.files = files;
            uploadFile();
        } else {
            showToast("Max file size is 100MB");
        }
    } else if (files.length > 1) {
        showToast("You can't upload multiple files");
    }
    dropZone.classList.remove("dragged");
});
dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dragged");
});
dropZone.addEventListener("dragleave", (e) => {
    dropZone.classList.remove("dragged");
    console.log("drag ended");
});

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dragged");

    // console.log("dropping file");
});

dropZone.addEventListener("dragleave", (e) => {
    dropZone.classList.remove("dragged");
    console.log("drag ended");
});

copyURLBtn.addEventListener("click", function () {
    fileURL.select();
    document.execCommand("copy");
})

function uploadFile() {
    var myfile = $('#fileInput')[0].files;
    const fd = new FormData();
    progressContainer.style.display = "block";
    fd.append("myfile", myfile[0]);
    $.ajax({
        xhr: function () {
            var xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener("progress", function (evt) {
                if (evt.lengthComputable) {
                    var percentComplete = (evt.loaded / evt.total) * 100;
                    console.log(percentComplete)

                    let percent = Math.round((100 * event.loaded) / event.total);
                    progressPercent.innerText = percent;
                    const scaleX = `scaleX(${percent/100})`;
                    bgProgress.style.transform = scaleX;
                    progressBar.style.transform = scaleX;
                    // Place upload progress bar visibility code here
                }
            }, false);
            return xhr;
        },
        url: `${baseUrl}api/files`,
        method: "POST",
        data: fd,
        cache: false,
        contentType: false,
        processData: false,
        success: function (res_data) {
            progressContainer.style.display = "none";
            sharingContainer.style.display = "block";
            fileURL.value = res_data.file;
            console.log(res_data)
            $("#file_link").val(res_data.file)
        }
    })
}

function sendEmailFun() {
    const from_email_address = $("#fromEmail").val();
    const to_email_address = $("#toEmail").val();    
    const fileURL = $("#fileURL").val();

    const uuid = fileURL.split('/').pop();    

    if(from_email_address == "" || from_email_address == null || !validateEmail(from_email_address)) {
        custom_alert ("Please Enter From Email Address","error"); return false;
    } 
    
    if(to_email_address == "" || to_email_address == null || !validateEmail(to_email_address)) {
        custom_alert ("Please Enter To Email Address","error"); return false;
    } 
    
    if(fileURL == null ) {
        custom_alert ("Something went wrong please try again","error"); return false;
    }    


    $("#sendEmail").prop("disabled",true).html("Please Wait...");   
    $.ajax({
       
        url: `${baseUrl}send-email`,
        method: "POST",
        data: { from_email_address: from_email_address, to_email_address: to_email_address,uuid:uuid },
        dataType: 'json',
        cache: false,
        success: function (res_data) {
            console.log(res_data)
            $("#sendEmail").prop("disabled",false).html("Send")
            if (res_data.success) custom_alert (res_data.success,"success")
            else custom_alert ("Something went wrong please try again","error")
            $("#fromEmail, #toEmail").val('');
        }
    })

}

function custom_alert(message, statusType) {
    notif({
        msg: message,
        type: statusType,
        position: "center"
    });
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
