var almacen = {
	db: null,
	nombreHabitacion: null,
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

	guardarHabitacion: function(nh, nd, dd, td, nc){
		almacen.db					= almacen.conectarDB();
		almacen.nombreHabitacion  	= nh;
		almacen.nombreDispositivo 	= nd;
		almacen.dirDispositivo 		= dd;
		almacen.tipoDispositivo		= td;
		almacen.numControles		= nc;

		almacen.db.transaction(almacen.tablaHabitacion, almacen.error, almacen.exito);

	},

	guardarHabitacionMenu: function(nh){
		almacen.db   				= almacen.conectarDB();
		almacen.nombreHabitacion  	= nh;

		almacen.db.transaction(almacen.tablaHabitacionMenu, almacen.error, almacen.exito);
	},

	tablaHabitacion: function(tx){
		//Crear tabla de historial
		tx.executeSql('CREATE TABLE IF NOT EXISTS ' + almacen.nombreHabitacion + ' (id INTEGER PRIMARY KEY, named, addrd, typed, numc)');
		//Insertar los datos de la nueva reservacion
		tx.executeSql('INSERT INTO ' + almacen.nombreHabitacion + ' (named, addrd, typed, numc) VALUES ("' + almacen.nombreDispositivo + '", "' + almacen.dirDispositivo + '", "' + almacen.tipoDispositivo + '", "' + almacen.numControles + '")');
	},

	tablaHabitacionMenu: function(tx){
		//Crear tabla de historial
		//alert("Agregando a menu: " + almacen.nombreHabitacion + typeof(almacen.nombreHabitacion));
		tx.executeSql('CREATE TABLE IF NOT EXISTS menu (id INTEGER PRIMARY KEY, nameroom)');
		//Insertar los datos de la nueva reservacion
		//alert('INSERT INTO menu (nameroom) VALUES (' + alamacen.nombreHabitacion );
		tx.executeSql('INSERT INTO menu (nameroom) VALUES ("' + almacen.nombreHabitacion + '")');
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
		alert('SELECT * FROM ' + almacen.nombreHabitacion);
		tx.executeSql('SELECT * FROM ' + almacen.nombreHabitacion, [], almacen.reconstruirHabitacion);
	},

	leerMenuHabitacion: function(tx){
		//Crear tabla de historial
		tx.executeSql('CREATE TABLE IF NOT EXISTS menu (id INTEGER PRIMARY KEY, nameroom)');
		//leer tabla historial
		alert('SELECT * FROM menu');
		tx.executeSql('SELECT * FROM menu', [], almacen.recuperarMenu);
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

			}
		}

	},

	recuperarMenu: function(tx, res){
		
		var cantidad = res.rows.length;
		//var resultado = '<tr><td colspan="4">No hay reservas en el historial</td></tr>';

		if(cantidad > 0){
			//si hay reservas en el historial
			for(var h = 0; h < cantidad; h++){
				var roomName = res.rows.item(h).nameroom;
    			var listItem = "<li><a href='#' room='" + roomName + "'>" + roomName + "</a></li>";
        
       			$("#roomList").append(listItem).listview('refresh');
        	}
        }
	}
};