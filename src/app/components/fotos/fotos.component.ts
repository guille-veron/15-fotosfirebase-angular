import { Component, OnInit, SelfDecorator } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import { CargaImagenesService } from 'src/app/services/carga-imagenes.service';

export interface Item {nombre: string; url:string, id:string};

@Component({
  selector: 'app-fotos',
  templateUrl: './fotos.component.html',
  styles: [
  ]
})
export class FotosComponent implements OnInit {

  private itemCollection: AngularFirestoreCollection<Item>;
  items : Observable<Item[]>;

  constructor(private afs:AngularFirestore,
              private cis: CargaImagenesService) { 
    this.itemCollection = afs.collection<Item>('img');
    this.items = this.itemCollection.valueChanges();
    
  }

  borrarFoto(foto: Item){
    console.log(foto.url);
   // this.cis.delete(foto)
      
  }

  ngOnInit(): void {
  }

}
