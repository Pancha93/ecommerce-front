import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Producto } from '../../services/producto.service';
import { Categoria } from '../../services/categoria.service';

export interface ProductoModalData {
  producto: Producto | null;
  categorias: Categoria[];
}

@Component({
  selector: 'app-producto-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <div class="producto-modal">
      <h2 mat-dialog-title>
        <mat-icon>{{ data.producto ? 'edit' : 'add_circle' }}</mat-icon>
        {{ data.producto ? 'Editar Producto' : 'Nuevo Producto' }}
      </h2>

      <mat-dialog-content>
        <form #productoForm="ngForm">
          <div class="row">
            <!-- Información Básica -->
            <div class="col-12">
              <h3 class="section-title">
                <mat-icon>info</mat-icon>
                Información Básica
              </h3>
              <mat-divider></mat-divider>
            </div>

            <div class="col-md-8 mt-3">
              <mat-form-field appearance="outline" class="w-100">
                <mat-label>Nombre del Producto</mat-label>
                <input 
                  matInput 
                  [(ngModel)]="productoFormData.nombre" 
                  name="nombre"
                  required
                  placeholder="Ingrese el nombre">
                <mat-icon matPrefix>shopping_bag</mat-icon>
              </mat-form-field>
            </div>

            <div class="col-md-4 mt-3">
              <mat-form-field appearance="outline" class="w-100">
                <mat-label>SKU</mat-label>
                <input 
                  matInput 
                  [(ngModel)]="productoFormData.sku" 
                  name="sku"
                  placeholder="Código único">
                <mat-icon matPrefix>qr_code</mat-icon>
              </mat-form-field>
            </div>

            <div class="col-md-6">
              <mat-form-field appearance="outline" class="w-100">
                <mat-label>Marca</mat-label>
                <input 
                  matInput 
                  [(ngModel)]="productoFormData.marca" 
                  name="marca"
                  placeholder="Marca del producto">
                <mat-icon matPrefix>label</mat-icon>
              </mat-form-field>
            </div>

            <div class="col-md-6">
              <mat-form-field appearance="outline" class="w-100">
                <mat-label>Categoría</mat-label>
                <mat-select 
                  [(ngModel)]="productoFormData.categoriaId" 
                  name="categoriaId"
                  required>
                  <mat-option [value]="null">Seleccione una categoría</mat-option>
                  <mat-option *ngFor="let categoria of data.categorias" [value]="categoria.id">
                    {{ categoria.nombre }}
                  </mat-option>
                </mat-select>
                <mat-icon matPrefix>category</mat-icon>
              </mat-form-field>
            </div>

            <div class="col-12">
              <mat-form-field appearance="outline" class="w-100">
                <mat-label>Descripción</mat-label>
                <textarea 
                  matInput 
                  [(ngModel)]="productoFormData.descripcion" 
                  name="descripcion"
                  rows="4"
                  placeholder="Describa las características del producto"></textarea>
                <mat-icon matPrefix>description</mat-icon>
              </mat-form-field>
            </div>

            <!-- Precios e Inventario -->
            <div class="col-12 mt-3">
              <h3 class="section-title">
                <mat-icon>attach_money</mat-icon>
                Precios e Inventario
              </h3>
              <mat-divider></mat-divider>
            </div>

            <div class="col-md-4 mt-3">
              <mat-form-field appearance="outline" class="w-100">
                <mat-label>Precio Regular</mat-label>
                <input 
                  matInput 
                  type="number" 
                  [(ngModel)]="productoFormData.precio" 
                  name="precio"
                  required
                  min="0"
                  step="0.01">
                <span matPrefix>$&nbsp;</span>
                <mat-icon matSuffix>monetization_on</mat-icon>
              </mat-form-field>
            </div>

            <div class="col-md-4 mt-3">
              <mat-form-field appearance="outline" class="w-100">
                <mat-label>Precio Oferta</mat-label>
                <input 
                  matInput 
                  type="number" 
                  [(ngModel)]="productoFormData.precioOferta" 
                  name="precioOferta"
                  min="0"
                  step="0.01">
                <span matPrefix>$&nbsp;</span>
                <mat-icon matSuffix>local_offer</mat-icon>
              </mat-form-field>
            </div>

            <div class="col-md-4 mt-3">
              <mat-form-field appearance="outline" class="w-100">
                <mat-label>Stock</mat-label>
                <input 
                  matInput 
                  type="number" 
                  [(ngModel)]="productoFormData.stock" 
                  name="stock"
                  required
                  min="0">
                <mat-icon matSuffix>inventory</mat-icon>
              </mat-form-field>
            </div>

            <div class="col-md-6">
              <mat-form-field appearance="outline" class="w-100">
                <mat-label>Peso (kg)</mat-label>
                <input 
                  matInput 
                  type="number" 
                  [(ngModel)]="productoFormData.peso" 
                  name="peso"
                  min="0"
                  step="0.01">
                <mat-icon matSuffix>scale</mat-icon>
              </mat-form-field>
            </div>

            <!-- Opciones -->
            <div class="col-12 mt-3">
              <h3 class="section-title">
                <mat-icon>tune</mat-icon>
                Opciones
              </h3>
              <mat-divider></mat-divider>
            </div>

            <div class="col-md-6 mt-3">
              <mat-checkbox 
                [(ngModel)]="productoFormData.activo" 
                name="activo"
                color="primary">
                <strong>Producto Activo</strong>
                <div class="checkbox-help">Visible en la tienda</div>
              </mat-checkbox>
            </div>

            <div class="col-md-6 mt-3">
              <mat-checkbox 
                [(ngModel)]="productoFormData.destacado" 
                name="destacado"
                color="accent">
                <strong>Producto Destacado</strong>
                <div class="checkbox-help">Aparece en sección destacados</div>
              </mat-checkbox>
            </div>
          </div>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">
          <mat-icon>close</mat-icon>
          Cancelar
        </button>
        <button 
          mat-raised-button 
          color="primary" 
          (click)="onSave()"
          [disabled]="!productoForm.valid">
          <mat-icon>save</mat-icon>
          Guardar
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .producto-modal {
      max-width: 900px;
    }

    h2[mat-dialog-title] {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #1976d2;
      margin: 0;
      padding: 20px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      margin: -24px -24px 0 -24px;
    }

    mat-dialog-content {
      padding: 24px;
      margin: 0;
      max-height: 70vh;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 500;
      color: #424242;
      margin-bottom: 8px;
    }

    .section-title mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: #1976d2;
    }

    mat-form-field {
      margin-bottom: 8px;
    }

    mat-checkbox {
      display: block;
      padding: 12px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    mat-checkbox:hover {
      background-color: #f5f5f5;
      border-color: #1976d2;
    }

    .checkbox-help {
      font-size: 12px;
      color: #757575;
      margin-top: 4px;
    }

    mat-dialog-actions {
      padding: 16px 24px;
      margin: 0 -24px -24px -24px;
      background-color: #f5f5f5;
      border-top: 1px solid #e0e0e0;
    }

    mat-dialog-actions button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .w-100 {
      width: 100%;
    }

    mat-divider {
      margin-bottom: 16px;
    }
  `]
})
export class ProductoModalComponent implements OnInit {
  productoFormData: any = {
    nombre: '',
    descripcion: '',
    precio: 0,
    precioOferta: null,
    stock: 0,
    sku: '',
    peso: 0,
    marca: '',
    categoriaId: null,
    activo: true,
    destacado: false
  };

  constructor(
    public dialogRef: MatDialogRef<ProductoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductoModalData
  ) {}

  ngOnInit(): void {
    if (this.data.producto) {
      this.productoFormData = {
        nombre: this.data.producto.nombre,
        descripcion: this.data.producto.descripcion || '',
        precio: this.data.producto.precio,
        precioOferta: this.data.producto.precioOferta || null,
        stock: this.data.producto.stock,
        sku: this.data.producto.sku || '',
        peso: this.data.producto.peso || 0,
        marca: this.data.producto.marca || '',
        categoriaId: this.data.producto.categoriaId,
        activo: this.data.producto.activo !== false,
        destacado: this.data.producto.destacado || false
      };
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.productoFormData);
  }
}
