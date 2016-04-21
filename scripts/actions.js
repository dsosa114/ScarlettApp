var scarlett = {
	deviceready: function(){
		//Esto es necesario para PhoneGap para que pueda ejecutar la aplicación
		document.addEventListener("deviceready", scarlett.onDeviceReady, false);
	},

	onDeviceReady: function() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', scarlett.onPause, false );
        document.addEventListener( 'resume', scarlett.onResume, false );
        
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        $("#createNRBtn").tap(scarlett.agregarNuevoCuarto);
        $("#createControlBtn").tap(scarlett.crearNuevoControlCuarto);
        $(document).on('pagebeforeshow', '#home', function(){
			//$("#roomList").listview('refresh');
			$("#roomList a").on("tap", scarlett.llenarPlantillaCuarto);
		});

		$(document).on('pagebeforeshow', '#roomTemplate', function(){
			$(document).off('slidestop', '.slider-int').on('slidestop', '.slider-int', function (e) {
				var device = $(this).attr("daddr");
            	var value = document.getElementById($(this).attr("id")).value;
            	var control = $(this).attr("control");

            	console.log("Dispositivo: " + device + ", Valor: " + value + ", Control: " + control);

            	scarlett.enviarData(device, value, control);
        	});
		});

        scarlett.ponerFecha();
    },

    onPause: function() {
        // TODO: This application has been suspended. Save application state here.
    },

    onResume: function() {
        // TODO: This application has been reactivated. Restore application state here.
    },

    agregarNuevoCuarto: function(){
    	var roomName = document.getElementById("newRoomName").value;
    	var listItem = "<li><a href='#' room='" + roomName + "'>" + roomName + "</a></li>";
        
        $("#roomList").append(listItem).listview('refresh');
        alert(listItem);
        //$("#roomList a").on("tap", scarlett.llenarPlantillaCuarto($(this)));

        window.location.href = "#home";
    },

    llenarPlantillaCuarto: function(room){
    	alert($(this).attr("room"));
    	window.location.href = "#roomTemplate";
    },

    enviarData: function(dev, val, con){
		//alert(nom+" "+email+" "+tel)
		$.ajax({
			method: "POST",
			url:"http://192.168.0.41:2000/data",
			//url:"http://scarlett.local:2000/data",
			//url:"http://192.168.42.1:2000/data",
			data:{
				modules:dev,
				points:val,
				control: con
			},
			timeout: 500,
			beforeSend: function(){
				alert("Sending...");
			},
			success: function(data){
				alert(data);
			},
			error: function(e){
				alert("Error de conexión con AJAX");
				//alert(e.response);
			}

		}).done(function(mensaje){
			alert(mensaje);
		});
	},

	enviarOutlet: function(dev, val, con){
		//alert(nom+" "+email+" "+tel)
		$.ajax({
			method: "POST",
			url:"http://192.168.0.41:2000/outlet",
			//url:"http://scarlett.local:2000/outlet",
			//url:"http://192.168.42.1:2000/outlet",
			data:{
				modules:dev,
				encendido:val,
				control: con
			},
			success: function(){

			},
			error: function(e){
				alert("Error de conexión con AJAX");
				//alert(e.response);
			}

		}).done(function(mensaje){
			alert(mensaje);
		});
	},

	crearNuevoControlCuarto: function(){
		var controlName = document.getElementById("newModuleName").value;
		var controlAddr = document.getElementById("newModuleAddr").value;
		var controlType = document.getElementById("newModuleType").value;
		var controlNumb = document.getElementById("newModuleNumb").value;
		var modName = controlName.split(' ').join('-');

		console.log(controlName + controlAddr + controlType + controlNumb + modName);

		$("#deviceList").append("<li data-role='list-divider'>" + controlName + "</li>").listview('refresh');
		for(var i = 1; i <= controlNumb; i++){
			modName = modName + "-" + i;
			if(controlType == "Luces"){
				$("#deviceList").append('<li><form class="ui-grid-a ui-responsive">\
					<div class="ui-block-a" style="width:15%"><input id="'+ modName + 'f" type="checkbox" daddr="' + controlAddr + '" control="L'+ i +'" data-role="flipswitch" class="selector"></div>\
					<div class="ui-block-b" style="width:80%"><input id="'+ modName + 's" class="slider-int" type="range" daddr="' + controlAddr + '" control="L'+ i +'" min="0" max="100" step="1" value="0" data-highlight="true"/></div>\
					</form></li>').listview('refresh').trigger("create");
				console.log("Foco " + i);
			} else if (controlType == "Contactos"){
				$("#deviceList").append('<li><input id="'+ modName + 'f" type="checkbox" daddr="' + controlAddr + '" control="O'+ i +'" data-role="flipswitch" class="selector"></li>').listview('refresh').trigger("create");
				console.log("Contacto " + i);
			} else if (controlType == "Persiana"){
				$("#deviceList").append('<li><form class="ui-grid-a ui-responsive">\
					<div class="ui-block-a" style="width:15%"><input id="'+ modName + 'f" type="checkbox" daddr="' + controlAddr + '" control="B" data-role="flipswitch" class="selector"></div>\
					<div class="ui-block-b" style="width:80%"><input id="'+ modName + 's" class="slider-int" type="range" daddr="' + controlAddr + '" control="B" min="0" max="100" step="1" value="0" data-highlight="true"/></div>\
					</form></li>').listview('refresh').trigger("create");
				console.log("Persiana " + i);
			}
		}

		window.location.href = "#roomTemplate";
		//var listItem = "<li><a href='#' id='" + device.address + "'>" + device.name + "</a></li>";
	},

    ponerFecha: function(){
		var fecha = new Date();
		var dia = fecha.getDate();
		var mes = fecha.getMonth()+1; // Los meses empiezan desde 0
		var year = fecha.getFullYear();

		var hoy = dia + "/" + mes + "/" +year;

		$(".fecha").html(hoy);
	}
}

//PhoneGap
//
$(scarlett.deviceready);

//Internet Explorer
//$(scarlett.onDeviceReady);