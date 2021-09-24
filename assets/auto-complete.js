$(document).on('ready',function(e){
  initAutocomplete();
})
var placeSearch, autocomplete;
  var componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
  };

function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */(document.getElementById('mce-ADDRESS-addr1')),
    {types: ['geocode']});

  // When the user selects an address from the dropdown, populate the address
  // fields in the form.
  autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
  // Get the place details from the autocomplete object.
  var place = autocomplete.getPlace();

  for (var component in componentForm) {
    document.getElementById(component).value = '';
    document.getElementById(component).disabled = false;
  }

  
  // Get each component of the address from the place details
  // and fill the corresponding field on the form.
  for (var i = 0; i < place.address_components.length; i++) {
    var addressType = place.address_components[i].types[0];
    if (componentForm[addressType]) {
      console.log(addressType);
      var val = place.address_components[i][componentForm[addressType]];
      document.getElementById(addressType).value = val;
      if(addressType.indexOf('route') > -1){
        console.log(addressType);
        $('#mce-ADDRESS-addr2').val(val);
      }
      if(addressType.indexOf('locality') > -1){
        $('#mce-ADDRESS-city').val(val);
      }
      if(addressType.indexOf('administrative_area_level_1') > -1){
        $('#mce-ADDRESS-state').val(val);
      }
      if(addressType.indexOf('country') > -1){
        console.log( $('#mce-ADDRESS-country option'),val)
        $('#mce-ADDRESS-country option').each(function(e){
          var text= $(this).text();
          var new_val = $(this).val();
          if(text.indexOf(val) > -1){
            $('#mce-ADDRESS-country').val(new_val);
            $('#mce-ADDRESS-country').trigger('click');
            
              $('#mce-ADDRESS-country').next('.nice-select').find('ul li').each(function(e){
                var text = $(this).data('value');
                if(text == new_val){
                  $(this).trigger('click');
                }
              });
              $('#mce-ADDRESS-country').next('.nice-select').removeClass('open');
          }
        })
      }
      
      if(addressType.indexOf('postal_code') > -1){
        $('#mce-ADDRESS-zip').val(val);
      }
    }
  }
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      autocomplete.setBounds(circle.getBounds());
    });
  }
}