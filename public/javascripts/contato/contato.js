var ContactUs = function () {

    return {
        //main function to initiate the module
        init: function () {
			var map;
			$(document).ready(function(){
			  map = new GMaps({
				div: '#map',
	            lat: -13.004333,
				lng: -38.494333,
			  });
			   var marker = map.addMarker({
		            lat: -23.400590,
					lng: -46.520597,
		            title: 'Teste, 99999.',
		            infoWindow: {
		                content: "<b>Teste, 795.</b> Teste <br>Teste"
		            }
		        });

			   marker.infoWindow.open(map, marker);
			});
        }
    };
}();

$(document).ready(function(){
	ContactUs.init();
});