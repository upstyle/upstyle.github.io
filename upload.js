//Disable
disableButton();
$('#upstyle-me').hide();

// Variables
let reader = new FileReader();
var f;
var mailAddress;

// Listeners
document.getElementById('files').addEventListener('change', handleFileSelect, false);

function enableButton() {
  $('#upload-file-btn').addClass('btn-primary');
  $('#upload-file-btn').removeClass('disabled');
  $('#upload-file-btn').prop('disabled', false);
}

function disableButton() {
  $('#upload-file-btn').addClass('disabled');
  $('#upload-file-btn').removeClass('btn-primary');
  $('#upload-file-btn').prop('disabled', true);
}

function loadingButton() {
  document.getElementById('upload-file-btn').innerHTML = "Uploading...";
}

function uploaded() {
  $('#upload-file-btn').hide();
  $('#preview').hide();
  $('#upload-holder').hide();
}

// Modal
$('#myModal').on('shown.bs.modal', function() {
  $('#myInput').trigger('focus')
})

// Email input
$('#email').focus(function() {
  $(this).val('');
  checkEmail();
});

$('#email').on("input", checkEmail);

// Send email input
$('#upstyle-me').click(function() {
  mailAddress = $('#email').val();
});

function checkEmail() {
  email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
  if (email_regex.test($('#email').val())) {
    $('#upstyle-me').show(300);
  } else {
    $('#upstyle-me').hide(300);
  }
}

function handleFileSelect(evt) {

  disableButton();

  var files = evt.target.files; // FileList object
  let prev = document.getElementById('preview')

    // Loop through the FileList and render image files as thumbnails.
    // for (var i = 0, f; f = files[i]; i++) {

  f = files[0]
  // Only process image files.
  if (!f.type.match('image.*')) {
  	prev.innerHTML = "Please upload images only.";
    return;
  }

  enableButton();

  // Closure to capture the file information.
  reader.onload = (function(theFile) {
    return function(e) {
      // Render thumbnail.
      prev.innerHTML = ['<img class="thumb" src="', e.target.result,
                        '" title="', escape(theFile.name), '"/>'].join('');
    };
  })(f);

  // Read in the image file as a data URL.
  reader.readAsDataURL(f);
}

$(function() {
  $('#upload-file-btn').click(function() {
      var url = 'https://validation-backend.herokuapp/upload';
      $('#modal-text').html("Your image is uploading...");
      var form_data = new FormData($('#upload-file')[0]);          
      form_data.append("address", mailAddress);
      disableButton();
      loadingButton();
      $.ajax({
          type: 'POST',
          url: url,
          data: form_data,
          cors: true,
          crossDomain: true,
          contentType: false,
          cache: false,
          processData: false,
          success: function(data) {
              console.log('Success! Data: ' + data);
              $('#modal-text').html("Your image has been uploaded! You'll receive an email from our bot once our AI has processed it.");
              enableButton();
          },
      });
      uploaded();
  });
});