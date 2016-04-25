var scarlett = {
    nombreHabitacion: null,

	deviceready: function(){
		//Esto es necesario para PhoneGap para que pueda ejecutar la aplicación
		document.addEventListener("deviceready", scarlett.onDeviceReady, false);
	},

	onDeviceReady: function() {
        // Handle the Cordova pause and resume events
        try{
            document.addEventListener( 'pause', scarlett.onPause, false );
            document.addEventListener( 'resume', scarlett.onResume, false );
        } catch (error){
            console.log("Pruebas locales. Error: " + error);
        }
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        $("#createNRBtn").tap(scarlett.agregarNuevoCuarto);
        $("#createControlBtn").tap(scarlett.crearNuevoControlCuarto);
        $("#addModuleBtn").tap(scarlett.enviarAddModule);
        $(document).on('pagecreate', '#home', function(){
			//$("#roomList").listview('refresh');
			$("#roomList a").on("tap", scarlett.llenarPlantillaCuarto);
		});

		$(document).on('pagebeforeshow', '#roomTemplate', function(){
			$(document).off('slidestop', '.slider-int').on('slidestop', '.slider-int', scarlett.slideStop);
        	$(document).off('change', '.selector').on('change', '.selector', scarlett.flipChange);
		});

        try{
            almacen.cargarMenuHabitacion();
        }catch(error){
            console.log("No hay base de datos disponible por el momento. Error: " + error);
        }
        
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
        
        try{
            almacen.guardarHabitacionMenu(roomName);
        }catch(error){
            console.log("No hay base de datos disponible por el momento. Error: " + error);
        }

        $("#roomList").append(listItem).listview('refresh');
        $("#roomList a").off('tap').on("tap", scarlett.llenarPlantillaCuarto);

        $("#newRoomDialog").popup("close");

        window.location.href = "#home";
    },

    llenarPlantillaCuarto: function(e){
    	//alert($(this).attr("room"));
        var room = $(this).attr("room");
        $("#deviceList").empty();
        scarlett.nombreHabitacion = room;

        try{
            almacen.cargarDatosHabitacion(room);
        }catch(error){
            console.log("No hay base de datos disponible por el momento. Error: " + error);
        }
        
    	window.location.href = "#roomTemplate";
    },

    enviarData: function(dev, val, con){
		//alert(nom+" "+email+" "+tel)
		$.ajax({
			method: "POST",
			url:"http://192.168.0.41:2000/data",
            //url:"localhost:2000/data",
			//url:"http://scarlett.local:2000/data",
			//url:"http://192.168.42.1:2000/data",
			data:{
				modules:dev,
				points:val,
				control: con
			},
			timeout: 1000,
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
            //url:"localhost:2000/outlet",
			//url:"http://scarlett.local:2000/outlet",
			//url:"http://192.168.42.1:2000/outlet",
			data:{
				modules:dev,
				encendido:val,
				control: con
			},
			timeout: 1000,
			error: function(e){
				alert("Error de conexión con AJAX");
				//alert(e.response);
			}

		}).done(function(mensaje){
			alert(mensaje);
		});
	},

    enviarAddModule: function(){
        $.mobile.loading( 'show', {text: "Buscando dispositivos. Espere...", textVisible: true, textonly: false});
        $.ajax({
            method: "GET",
            url:"http://192.168.0.41:2000/addModule",
            //url:"http://localhost:2000/addModule",
            //url:"http://scarlett.local:2000/outlet",
            //url:"http://192.168.42.1:2000/outlet",
            timeout: 60000,
            error: function(e){
                $.mobile.loading( 'hide');
                try{
                    navigator.notification.alert("Error de conexión, no se pudo agregar módulo automáticamente.", function(){
                        $("#newModuleAddr").textinput('enable');
                        $("#newModuleType").selectmenu('enable');
                        $("#newModuleNumb").selectmenu('enable');
                        $("#newModuleDialog").popup("open");
                        //window.location.href = "#newModuleDialog";
                    }, "Error", "Ok");
                } catch (error){
                    console.log("Prueba local. Error: " + error);
                    alert("Error de conexión, no se pudo agregar módulo automáticamente.");
                    $("#newModuleDialog").popup("open");
                }
                //alert(e.response);
            }

        }).done(function(mensaje){
            $.mobile.loading( 'hide');
            if(mensaje == "No module detected. Check your conection"){
                try{
                    navigator.notification.alert("No hay módulos conectados, activando modo manual.", function(){
                        $("#newModuleAddr").textinput('enable');
                        $("#newModuleType").selectmenu('enable');
                        $("#newModuleNumb").selectmenu('enable');
                        $("#newModuleDialog").popup("open");
                        //window.location.href = "#newModuleDialog";
                    }, "Error", "Ok");
                } catch (error){
                    console.log("Prueba local. Error: " + error);
                    alert("No hay módulos conectados, activando modo manual.");
                    $("#newModuleDialog").popup("open");
                }
                
            } else{
                //alert(mensaje);
                var splitMsg = mensaje.split(':');
                var controlAddr = document.getElementById("newModuleAddr");
                var controlType = document.getElementById("newModuleType");
                var controlNumb = document.getElementById("newModuleNumb");

                controlAddr.value = splitMsg[0];

                if(splitMsg[1].includes('L')){
                    controlType.value = "Luces";
                    controlNumb.value = parseInt(splitMsg[1]);
                } else if (splitMsg[1].includes('B')){
                    controlType.value = "Persiana";
                    controlNumb.value = 1;
                } else if (splitMsg[1].includes('O')){
                    controlType.value = "Contactos";
                    controlNumb.value = parseInt(splitMsg[1]);
                }
                try{
                    $("#newModuleAddr").textinput('disable');
                    $("#newModuleType").selectmenu('disable');
                    $("#newModuleNumb").selectmenu('disable');
                } catch(error){
                    alert("Error: " + error);
                }

                //$("#newModuleDialog").popup("open");
                alert(mensaje);
            }
        });
    },

	crearNuevoControlCuarto: function(){
		var controlName = document.getElementById("newModuleName").value;
		var controlAddr = document.getElementById("newModuleAddr").value;
		var controlType = document.getElementById("newModuleType").value;
		var controlNumb = document.getElementById("newModuleNumb").value;
		var modName = controlName.split(' ').join('-');

		//alert(controlName + controlAddr + controlType + controlNumb + modName);

		$("#deviceList").append("<li data-role='list-divider'>" + controlName + "</li>").listview('refresh');
		for(var i = 1; i <= controlNumb; i++){
			newModName = modName + "-" + i;
			if(controlType == "Luces"){
				$("#deviceList").append('<li><form class="ui-grid-a ui-responsive">\
					<div class="ui-block-a" style="width:15%"><input id="'+ newModName + 'f" type="checkbox" daddr="' + controlAddr + '" control="L'+ i +'" data-role="flipswitch" class="selector"></div>\
					<div class="ui-block-b" style="width:80%"><input id="'+ newModName + 's" class="slider-int" type="range" daddr="' + controlAddr + '" control="L'+ i +'" min="0" max="100" step="1" value="0" data-highlight="true"/></div>\
					</form></li>').listview('refresh').trigger("create");
				console.log("Foco " + i);
			} else if (controlType == "Contactos"){
				$("#deviceList").append('<li><input id="'+ newModName + 'f" type="checkbox" daddr="' + controlAddr + '" control="O'+ i +'" data-role="flipswitch" class="selector"></li>').listview('refresh').trigger("create");
				console.log("Contacto " + i);
			} else if (controlType == "Persiana"){
				$("#deviceList").append('<li><form class="ui-grid-a ui-responsive">\
					<div class="ui-block-a" style="width:15%"><input id="'+ newModName + 'f" type="checkbox" daddr="' + controlAddr + '" control="B" data-role="flipswitch" class="selector"></div>\
					<div class="ui-block-b" style="width:80%"><input id="'+ newModName + 's" class="slider-int" type="range" daddr="' + controlAddr + '" control="B" min="0" max="100" step="1" value="0" data-highlight="true"/></div>\
					</form></li>').listview('refresh').trigger("create");
				console.log("Persiana " + i);
			}
		}

        try{
            almacen.guardarHabitacion(scarlett.nombreHabitacion, controlName, controlAddr, controlType, controlNumb);
        }catch(error){
            console.log("No hay base de datos disponible por el momento. Error: " + error);
        }
        
        $("#newModuleDialog").popup("close");
		window.location.href = "#roomTemplate";
		//var listItem = "<li><a href='#' id='" + device.address + "'>" + device.name + "</a></li>";
	},

	flipChange: function(e){
		var flipId = $(this).attr("id");
       	var sliderId = flipId.slice(0, flipId.length - 1) + "s";

        var flipswitch = document.getElementById(flipId);
        var slider = document.getElementById(sliderId);

        var device = $(this).attr("daddr");
        var value = "ON"
        var control = $(this).attr("control");

        if (!flipswitch.checked) {
        	if(control != "O1" && control != "O2"){
            	slider.value = "0";
            }
            value = "OFF"
            $(".slider-int").slider("refresh");
        } else {
        	if(control != "O1" && control != "O2"){
            	slider.value = "100";
            }
            $(".slider-int").slider("refresh");
        }
        		
        //console.log(flipId + ": " + flipswitch.checked + ", " +sliderId + ": " + slider.value);
        if(control != "O1" && control != "O2"){
        	console.log(device + ", " + slider.value + ", " + control);
        	scarlett.enviarData(device, slider.value, control);
        }
        else{
        	console.log(device + ", " + value + ", " + control);
        	scarlett.enviarOutlet(device, value, control);
        }
    },

    slideStop: function(e){
    	var sliderId = $(this).attr("id");
       	var flipId = sliderId.slice(0, sliderId.length - 1) + "f";

        var flipswitch = document.getElementById(flipId);
        var slider = document.getElementById(sliderId);

		var device = $(this).attr("daddr");
        var value = document.getElementById($(this).attr("id")).value;
        var control = $(this).attr("control");

        console.log($('#' + flipId ).val() + ": " + flipswitch.checked + ", " +sliderId + ": " + slider.value);
        if (value >= 1) {
        	$(document).off('change', '.selector');
        	$('#' + flipId )
                .prop('checked', true)
                .flipswitch('refresh');
            $(document).on('change', '.selector', scarlett.flipChange);
        } else {
        	$(document).off('change', '.selector');
            $('#' + flipId )
                //.off("change")
                .prop('checked', false)
                .flipswitch('refresh')
                //.on("change", scarlett.flipChange);
            $(document).on('change', '.selector', scarlett.flipChange);
        }
        console.log("Dispositivo: " + device + ", Valor: " + value + ", Control: " + control);

        scarlett.enviarData(device, value, control);
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
//console.log("Pruebas locales. Error: " + error);
//Internet Explorer
//$(scarlett.onDeviceReady);