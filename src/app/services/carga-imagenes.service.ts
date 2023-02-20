import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import  'firebase/compat/storage';
import firebase from 'firebase/compat/app';
import { FileItem } from '../models/file-item';

@Injectable({
  providedIn: 'root'
})
export class CargaImagenesService {

  private CARPETA_IMAGENES = 'img';

  constructor(private db: AngularFirestore) {

   }

   cargarImagenesFirebase(imagenes : FileItem[]){
     const storageRef = firebase.storage().ref();

     for (const item of imagenes) {
       item.estaSubiendo = true;
       if (item.progreso >= 100) {
         continue;
       }

       const uploadTask : firebase.storage.UploadTask = 
                storageRef.child(`${this.CARPETA_IMAGENES}/${ item.nombre }`)
                          .put(item.archivo);

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        
        (snapshot : firebase.storage.UploadTaskSnapshot) => item.progreso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        (error) => console.error('Error al subir', error),
        () => {          
          uploadTask.snapshot.ref.getDownloadURL()
            .then((downloadURL) => {
                console.log('imagen cargada correctamenet');
                item.estaSubiendo = false;
                item.url = downloadURL
                this.guardarImagen({
                  nombre : item.nombre,
                  url: item.url,
                  id: ''
                });    
              }); 
        }       
        
        )
     }
   }
  delete(imagen: {nombre:string, url:string, id: string}) {
    const storageRef = firebase.storage().ref(); 
    
    return storageRef.storage.refFromURL(imagen.url).delete()
        .then(() => {
          this.db.doc('');
          this.db.collection(`${this.CARPETA_IMAGENES}`,ref => ref.where('id', '==', imagen.id));
        });
    //this.db.doc(`${this.CARPETA_IMAGENES}/${imagen.id}`).delete();
  }
   private guardarImagen(imagen: {nombre:string, url:string, id:string}){
     imagen.id = this.db.createId();
     this.db.collection(`${this.CARPETA_IMAGENES}`)
        .add(imagen);     
   }
}
