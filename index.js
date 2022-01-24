const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

//https://firebase.google.com/docs/functions/write-firebase-functions
//funcion se crea al ejecutarla
exports.onUserCreate = functions.firestore.document('FALLECIDO/{FALLECIDOId}').onCreate(async (snap, context) => {
  const values = snap.data();
  const query = db.collection("SERVICIO_MORTUORIO");
  const snapshot = await query.where("SM_ID", "==", values.SM_ID).get();
  var servicio=""
  snapshot.forEach(x=>{
    servicio=x.data().SM_NOMBRE;
  })

  try {
    if(servicio == "embalsamamiento"){
      
     const snapshot = await db.collection("FALLECIDO").where("F_NOMBRE", "==", values.F_NOMBRE).get(); 
     var f_difuncion=""
     var h_difuncion=""
     snapshot.forEach(x=>{
      f_difuncion=x.data().F_FECHA_DIFUNCION;
      h_difuncion=x.data().F_HORA_DIFUNCION;  
    }) 
    var fecha_actual= fechactual();
    var fecha_fallecido=configfecha(f_difuncion, h_difuncion);
    var totaldias= diferenciadias(fecha_actual, fecha_fallecido);
     if(totaldias>=2){
      console.log("No se puede realizar el embalsamamiento porque han pasado mas de 48horas desde la defuncion")
     }
    }
  } catch (error) {
    console.log(error);
  }

});
function configfecha(fecha, horas){
  var año = fecha.substring(0, 4);
var mes = (parseInt(fecha.substring(5, 6)) + 1);
var dia = fecha.substring(8, 10);
var horas = horas.substring(0, 2);
  var minutos = horas.substring(3, 5);
  var segundos = horas.substring(6, 8); 
  var f_date = new Date(año, mes, dia, horas, minutos, segundos);
return f_date;
}
function fechactual(){
  var date = new Date().toISOString();
  var año = date.substring(0, 4);
  var mes = (parseInt(date.substring(5, 6)) + 1);
  var dia = date.substring(8, 10);
  var f_actual = new Date(año, mes, dia);
  return f_actual;
}

function diferenciadias(fecha1, fecha2){
  var diasdif= fecha1.getTime()-fecha2.getTime();
  var contdias = Math.round(diasdif/(1000*60*60*24));
  return contdias;
}

