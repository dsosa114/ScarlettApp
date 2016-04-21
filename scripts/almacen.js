var almacen = {
	db: null,
	tipoHabitacion: null;
	nDispositivos: null;
	numHabitaciones: null;
	numDias: null;

	conectarDB: function(){
		return window.openDatabase("ScarlettApp", "1.0", "Scarlett App", 200000);
	},

	error: function(error){
		alert("Error: " + error.message);
	},

	exito: function(){
		alert("Exito");

	},

	guardarHabitacion: function(th, np, nh, nd){
		almacen.db				= almacen.conectarDB();
		almacen.tipoHabitacion  = th;
		almacen.numPersonas 	= np;
		almacen.numHabitaciones = nh,
		almacen.numDias 		= nd;

		almacen.db.transaction(almacen.tablaHistorial, almacen.error, almacen.exito);

	}
};