import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Nota } from '../models/nota';

@Injectable({
  providedIn: 'root'
})
export class NotasService{

  private readonly NOTAS_URL='http://localhost/agua-poin/public/api/notas';
  private readonly HTTP_OPTIONS= {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getNotas(): Observable<any>{

    return this.http.get<any>(this.NOTAS_URL)
      .pipe(
        map(
          res => {
            return res.map(item => { return new Nota(item.id, item.titulo, item.cuerpo,
              item.media, item.src) });
          }
        ),
        tap(_ => this.log('fetched notas')),
        catchError(this.handleError('getNotas', []))
      );
  }//end getNotas

  getNota(id: number): Observable<any>{

    return this.http.get<any>(`${this.NOTAS_URL}/${id}`)
    .pipe(
      map(
        item => { return new Nota(item.id, item.titulo, item.cuerpo,
          item.media, item.src) }
      ),
      tap(_ => this.log(`fetched nota id:${id}`)),
      catchError(this.handleError('getNota', []))
    )
  }//end getNota

  storeNota(nota: Nota): Observable<any>{

    let notaData: FormData= new FormData();
    notaData.append('titulo', nota.getTitulo());
    notaData.append('cuerpo', nota.getCuerpo());
    notaData.append('media', nota.getMedia());
    
    if(nota.getMedia() == 'imagen'){
      notaData.append('src', nota.getImgFile());
    }else{
      notaData.append('src', nota.getSrc());
    }

    return this.http.post<any>(this.NOTAS_URL, notaData)
      .pipe(
        tap(nota => this.log(`stored nota id:${nota.id}`)),
        catchError(this.handleError('storeNota', []))
      );
  }//end storeNota

  updateNota(id: number, nota: Nota): Observable<any>{

    let notaData: FormData= new FormData();
    notaData.append('_method', 'PUT');
    notaData.append('titulo', nota.getTitulo());
    notaData.append('cuerpo', nota.getCuerpo());
    notaData.append('media', nota.getMedia());
    
    if(nota.getMedia() == 'imagen'){
      notaData.append('src', nota.getImgFile());
    }else{
      notaData.append('src', nota.getSrc());
    }

    return this.http.post(`${this.NOTAS_URL}/${id}`, notaData).
      pipe(
        tap(_ => this.log(`updated nota id:${id}`)),
        catchError(this.handleError('updateNota', []))
      );
  }//end updateNota

  deleteNota(nota: Nota | number): Observable<any>{

    const id = typeof nota === 'number' ? nota : nota.getId();

    return this.http.delete(`${this.NOTAS_URL}/${id}`, this.HTTP_OPTIONS).
      pipe(
        tap(_=> this.log(`deleted nota id:${id}`)),
        catchError(this.handleError('deletedNota', []))
      );
  }//end deleteNota

  private handleError<T> (operation = 'operation', result?: T){
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }//end handleError

  private log(message: string): void{

    this.messageService.add(`NotasService: ${message}`);
  }//end log
}//end NotasService
