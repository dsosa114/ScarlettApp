var almacen = {
	db: null,
	nombreHabitacion: null,
	descriHabitacion: null,
	iconoHabitacion: null,
	nombreDispositivo: null,
	dirDispositivo: null,
	tipoDispositivo: null,
	numControles: null,

	conectarDB: function(){
		return window.openDatabase("ScarlettApp", "1.0", "Scarlett App", 1000000);
	},

	error: function(error){
		alert("Error " + error.code + ": " + error.message);
	},

	exito: function(){
		console.log("Exito");

	},

	comprobarExistenciaMenu: function(nh, dh, ih){
		almacen.db   				= almacen.conectarDB();
		almacen.nombreHabitacion  	= nh;
		almacen.descriHabitacion	= dh;
		almacen.iconoHabitacion		= ih;

		almacen.db.transaction(almacen.disponibilidadCuartos, almacen.error, almacen.exito);
	},

	disponibilidadCuartos: function(tx){
		//Crear tabla de historial
		//alert("Agregando a menu: " + almacen.nombreHabitacion + typeof(almacen.nombreHabitacion));
		tx.executeSql('CREATE TABLE IF NOT EXISTS menu (id INTEGER PRIMARY KEY, nameroom, descroom, iconroom)');
		//Insertar los datos de la nueva reservacion
		//alert('SELECT * FROM menu WHERE nameroom = "' + almacen.nombreHabitacion + '"');
		tx.executeSql('SELECT * FROM menu WHERE nameroom = "' + almacen.nombreHabitacion + '"', [], almacen.comprobarDisponibilidad);
		//alert("comprobado");
	},

	guardarHabitacion: function(nh, nd, dd, td, nc){
		almacen.db					= almacen.conectarDB();
		almacen.nombreHabitacion  	= nh;
		almacen.nombreDispositivo 	= nd;
		almacen.dirDispositivo 		= dd;
		almacen.tipoDispositivo		= td;
		almacen.numControles		= nc;

		almacen.db.transaction(almacen.tablaHabitacion, almacen.error, almacen.exito);

	},

	eliminarHabitacionMenu: function(nh){
		almacen.db   				= almacen.conectarDB();
		almacen.nombreHabitacion  	= nh;

		almacen.db.transaction(almacen.eliminarMenuDispositivos, almacen.error, almacen.exito);
	},

	eliminarDispositivoHabitacion: function(nh, nd){
		almacen.db 					= almacen.conectarDB();
		almacen.nombreHabitacion	= nh;
		almacen.nombreDispositivo 	= nd;

		almacen.db.transaction(almacen.borrarDispositivo, almacen.error, almacen.exito);

	},

	borrarDispositivo: function(tx){
		tx.executeSql('DELETE FROM ' + almacen.nombreHabitacion + ' WHERE named = "' + almacen.nombreDispositivo + '"');
		navigator.notification.alert("Se elimino " + almacen.nombreDispositivo + " de la habitación " + almacen.nombreHabitacion , function(){
			$( "#confirm2" ).popup( "hide" );
           	return true;
        }, "¡Éxito!", "Ok");
	},

	guardarHabitacionMenu: function(nh, dh, ih){
		almacen.db   				= almacen.conectarDB();
		almacen.nombreHabitacion  	= nh;
		almacen.descriHabitacion	= dh;
		almacen.iconoHabitacion		= ih;

		almacen.db.transaction(almacen.tablaHabitacionMenu, almacen.error, almacen.exito);
	},

	tablaHabitacion: function(tx){
		//Crear tabla de historial
		tx.executeSql('CREATE TABLE IF NOT EXISTS ' + almacen.nombreHabitacion + ' (id INTEGER PRIMARY KEY, named, addrd, typed, numc)');
		//Insertar los datos de la nueva reservacion
		tx.executeSql('INSERT INTO ' + almacen.nombreHabitacion + ' (named, addrd, typed, numc) VALUES ("' + almacen.nombreDispositivo + '", "' + almacen.dirDispositivo + '", "' + almacen.tipoDispositivo + '", "' + almacen.numControles + '")');
	},

	eliminarMenuDispositivos: function(tx){
		//Eliminar tabla de habitacion
		tx.executeSql('DROP TABLE IF EXISTS ' + almacen.nombreHabitacion);
		//Eliminar habitacion del menu
		tx.executeSql('DELETE FROM menu WHERE nameroom = "' + almacen.nombreHabitacion + '"');
		navigator.notification.alert("Se elimino " + almacen.nombreHabitacion + " y todos sus dispositivos correctamente" , function(){
				$( "#confirm" ).popup( "hide" );
           		return true;
            }, "¡Éxito!", "Ok");
	},

	tablaHabitacionMenu: function(tx){
		//Crear tabla de historial
		//alert("Agregando a menu: " + almacen.nombreHabitacion + typeof(almacen.nombreHabitacion));
		tx.executeSql('CREATE TABLE IF NOT EXISTS menu (id INTEGER PRIMARY KEY, nameroom, descroom, iconroom)');
		//Insertar los datos de la nueva reservacion
		//alert('INSERT INTO menu (nameroom) VALUES (' + alamacen.nombreHabitacion );
		tx.executeSql('INSERT INTO menu (nameroom, descroom, iconroom) VALUES ("' + almacen.nombreHabitacion + '", "' + almacen.descriHabitacion + '", "' + almacen.iconoHabitacion + '")');
		//alert("ya hay cuartos menu");
	},

	cargarDatosHabitacion: function(room){
		almacen.db = almacen.conectarDB();
		almacen.nombreHabitacion = room;
		almacen.db.transaction(almacen.leerHabitacion,almacen.error);
	},

	cargarMenuHabitacion: function(){
		almacen.db = almacen.conectarDB();
		
		almacen.db.transaction(almacen.leerMenuHabitacion,almacen.error);
	},

	leerHabitacion: function(tx){
		//Crear tabla de historial
		tx.executeSql('CREATE TABLE IF NOT EXISTS ' + almacen.nombreHabitacion + ' (id INTEGER PRIMARY KEY, named, addrd, typed, numc)');
		//leer tabla historial
		tx.executeSql('SELECT * FROM ' + almacen.nombreHabitacion, [], almacen.reconstruirHabitacion);
	},

	leerMenuHabitacion: function(tx){
		//Crear tabla de historial
		tx.executeSql('CREATE TABLE IF NOT EXISTS menu (id INTEGER PRIMARY KEY, nameroom, descroom, iconroom)');
		//leer tabla historial
		tx.executeSql('SELECT * FROM menu', [], almacen.recuperarMenu);
	},

	comprobarDisponibilidad: function(tx, res){
		var cantidad = res.rows.length;
		//var listItem = "<li><a href='#' class='roomItem' room='" + almacen.nombreHabitacion + "'><img src='img/iconos/recamara.png'/>" + almacen.nombreHabitacion + "</a><a href='#' class='delete'>Delete</a></li>";
		var listItem = "<li><a href='#' class='roomItem' room='" + almacen.nombreHabitacion + "'><img src='img/iconos/"+ almacen.iconoHabitacion +".png'/><h2>" + almacen.nombreHabitacion + "</h2><p>" + almacen.descriHabitacion + "</p></a><a href='#' class='delete'>Delete</a></li>";
		if(cantidad > 0){
			try{
                navigator.notification.alert("Error, no se pudo agregar el cuarto porque este ya existe.", function(){
                    return false;
                        //window.location.href = "#newModuleDialog";
                }, "Error", "Ok");
            } catch (error){
                console.log("Prueba local. Error: " + error);
                alert("Error, no se pudo agregar el cuarto porque este ya existe.");
            }
		} else{
            $("#roomList").append(listItem).listview('refresh');
            $(".roomItem").off('tap').on("tap", scarlett.llenarPlantillaCuarto);
            $(".roomItem").off('taphold').on("taphold", function(){
                $(".roomItem").off("tap");
                /*$( document ).on( "swipeleft swiperight", "#roomList li.ui-li-has-alt", function( event ) {
                    var listitem = $( this ),
                    // These are the classnames used for the CSS transition
                    dir = event.type === "swipeleft" ? "left" : "right",
                    // Check if the browser supports the transform (3D) CSS transition
                    transition = $.support.cssTransform3d ? dir : false;
                    //scarlett.confirmAndDelete( listitem, transition );
                });*/
                $( "#roomList" ).removeClass( "touch" );
            });
            // Click delete split-button to remove list item
            $( ".delete" ).off('tap').on( "tap", function() {
                var listitem = $( this ).parent( "li.ui-li-has-alt" );
                scarlett.confirmAndDelete( listitem );
            });
            
            almacen.guardarHabitacionMenu(almacen.nombreHabitacion, almacen.descriHabitacion, almacen.iconoHabitacion);
            //almacen.db.transaction(almacen.tablaHabitacionMenu, almacen.error, almacen.exito);
		}
	},

	reconstruirHabitacion: function(tx, res){
		var cantidad = res.rows.length;
		//var resultado = '<tr><td colspan="4">No hay reservas en el historial</td></tr>';

		if(cantidad > 0){
			//si hay reservas en el historial
			//var resultado='';
			for(var h = 0; h < cantidad; h++){
				var controlName = res.rows.item(h).named;
				var controlAddr = res.rows.item(h).addrd;
				var controlType = res.rows.item(h).typed;
				var controlNumb = parseInt(res.rows.item(h).numc);
				var modName = controlName.split(' ').join('-');
				var valid_name = 0;
				//alert(controlName + controlAddr + controlType + controlNumb + modName);
        		var listItems = $("#deviceList .deviceItem");
        		listItems.each(function(index, li) {
            		if(modName == $(li).attr('name')){
                		valid_name++;
            		}
            		console.log(modName + ", " + $(li).attr('name') + ", " + valid_name);// and the rest of your code
        		});

        		if(valid_name == 0){
		  			//$("#deviceList").append("<li data-role='list-divider' daddr='" + controlAddr + "'>" + controlName + "</li>").listview('refresh');
          			$("#deviceList").append("<li name='"+ modName +"' class='deviceItem' data-role='collapsible' data-collapsed='false' data-iconpos='right' daddr='" + controlAddr + "'><h2>" + controlName + "</h2><ul data-role='listview' id='" + modName + "''></ul></li>").listview('refresh').trigger("create");
          			$(".deviceItem").off('taphold').on('taphold', function(){
            			scarlett.confirmAndDelete2($(this));
          			});

		  			for(var i = 1; i <= controlNumb; i++){
		    			newModName = modName + "-" + i;
						if(controlType == "Luces"){
                			//console.log(modName);
			     			$('#'+ modName).append('<li>\
                    			<form class="ui-grid-a ui-responsive">\
								<div class="ui-block-a" style="width:15%"><input id="'+ newModName + 'f" type="checkbox" daddr="' + controlAddr + '" control="L'+ i +'" data-role="flipswitch" class="selector"></div>\
								<div class="ui-block-b" style="width:80%"><input id="'+ newModName + 's" class="slider-int" type="range" daddr="' + controlAddr + '" control="L'+ i +'" min="0" max="100" step="1" value="0" data-highlight="true"/></div>\
								</form></li>').listview('refresh').trigger("create");
							console.log("Foco " + i);
						} else if (controlType == "Contactos"){
							$('#'+ modName).append('<li><input id="'+ newModName + 'f" type="checkbox" daddr="' + controlAddr + '" control="O'+ i +'" data-role="flipswitch" class="selector"></li>').listview('refresh').trigger("create");
							console.log("Contacto " + i);
						} else if (controlType == "Persiana"){
                			var controlOrientation = document.getElementById("blindOrientation").value;

							$('#'+ modName).append('<li>\
                    			<form class="ui-grid-a ui-responsive">\
								<div class="ui-block-a" style="width:15%"><input id="'+ newModName + 'f" type="checkbox" daddr="' + controlAddr + '" control="B" data-role="flipswitch" class="selector"></div>\
								<div class="ui-block-b" style="width:80%"><input id="'+ newModName + 's" class="slider-int" type="range" daddr="' + controlAddr + '" control="B" min="0" max="100" step="1" value="0" data-highlight="true"/></div>\
								</form></li>').listview('refresh').trigger("create");
							console.log("Persiana " + i);
                			if (controlOrientation == "Normal"){
                    			scarlett.enviarOptions(controlAddr, 10);
                			} else{
                    			scarlett.enviarOptions(controlAddr, 10);
                			}
						}
		  			}
        		}
			}
		} else{
			alert("Habitacion vacia");
		}

	},

	recuperarMenu: function(tx, res){
		var cantidad = res.rows.length;
		//var resultado = '<tr><td colspan="4">No hay reservas en el historial</td></tr>';

		if(cantidad > 0){
			//si hay reservas en el historial
			for(var h = 0; h < cantidad; h++){ 
				var roomName = res.rows.item(h).nameroom;
    			var roomDesc = res.rows.item(h).descroom;
        		var roomIcon = res.rows.item(h).iconroom;
        		//console.log(roomIcon);

    			var listItem = "<li><a href='#' class='roomItem' room='" + roomName + "'><img src='img/iconos/"+ roomIcon +".png'/><h2>" + roomName + "</h2><p>" + roomDesc + "</p></a><a href='#' class='delete'>Delete</a></li>";
    
       			$("#roomList").append(listItem).listview('refresh');
        	}
        	$(".roomItem").off('tap').on("tap", scarlett.llenarPlantillaCuarto);
        	$(".roomItem").off('taphold').on("taphold", function(){
                $(".roomItem").off("tap");
                /*$( document ).on( "swipeleft swiperight", "#roomList li.ui-li-has-alt", function( event ) {
                    var listitem = $( this ),
                    // These are the classnames used for the CSS transition
                    dir = event.type === "swipeleft" ? "left" : "right",
                    // Check if the browser supports the transform (3D) CSS transition
                    transition = $.support.cssTransform3d ? dir : false;
                    //scarlett.confirmAndDelete( listitem, transition );
                });*/
                $( "#roomList" ).removeClass( "touch" );
            });
        	// Click delete split-button to remove list item
            $( ".delete" ).off('tap').on( "tap", function() {
                var listitem = $( this ).parent( "li.ui-li-has-alt" );
                scarlett.confirmAndDelete( listitem );
            });
        }
	}
};