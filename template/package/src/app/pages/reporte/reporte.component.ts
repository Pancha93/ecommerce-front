import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Importaciones de Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import {MatChip, MatChipListbox, MatChipSet} from '@angular/material/chips';

/**
 * Interfaz que define un atributo de entidad
 */
interface EntityAttribute {
  name: string;
  type: string;
  selected: boolean;
  isTextArea?: boolean;
  entity?: string;
}

/**
 * Componente para la generación de reportes
 * Permite seleccionar entidades y sus atributos para generar un reporte personalizado
 */
@Component({
  selector: 'app-reporte',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    DatePipe, 
    MatChipListbox,
    MatChip,
    MatChipSet
  ],
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.scss'],
  providers: [DatePipe]
})
export class ReporteComponent implements OnInit {
  /** Lista de todas las entidades disponibles */
  availableEntities: string[] = [];

  /** Control para el selector de entidades */
  entityControl = new FormControl('');

  /** Entidad seleccionada actualmente */
  selectedEntity: string | null = null;

  /** Columnas a mostrar en la tabla de atributos */
  displayedColumns: string[] = ['name', 'type', 'actions'];

  /** Data source para la tabla de atributos */
  attributesDataSource = new MatTableDataSource<EntityAttribute>([]);

  /** Atributos seleccionados para el reporte */
  selectedAttributes: EntityAttribute[] = [];

  /** Flag para indicar si se está generando un reporte */
  isGeneratingReport = false;

  /** Referencias a componentes de Angular Material */
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  /** Mapeo de entidades y sus atributos */
  private entityAttributesMap: Map<string, EntityAttribute[]> = new Map();

  /** Mapeo de servicios para cada entidad */
  private entityServicesMap: Map<string, any> = new Map();

  /**
   * Constructor del componente
   * @param snackBar Servicio para mostrar notificaciones
   * @param httpClient Cliente HTTP para realizar peticiones
   * @param datePipe Pipe para formatear fechas
   */
  constructor(
    private snackBar: MatSnackBar,
    private httpClient: HttpClient,
    private datePipe: DatePipe
  ) {
    // Inicializar el componente
    this.initializeEntities();
    this.initializeServices();
  }

  /**
   * Método de inicialización
   */
  ngOnInit(): void {
    // Suscribirse a cambios en el selector de entidades
    this.entityControl.valueChanges.subscribe(value => {
      if (value) {
        // Limpiar atributos seleccionados al cambiar de entidad
        this.resetSelectedAttributes();
        
        this.selectedEntity = value;
        this.loadEntityAttributes(value);
      }
    });
  }

  /**
   * Inicializa la lista de entidades disponibles
   * Esta información se obtiene de las entidades generadas previamente
   */
  private initializeEntities(): void {
    // Lista de entidades generadas automáticamente
    this.availableEntities = [
      'Ordenlaboratorio',
    ];

    // Inicializar atributos para cada entidad
    this.initializeEntityAttributes();
  }

  /**
   * Inicializa los servicios para cada entidad
   * Estos servicios se utilizarán para obtener los datos para el reporte
   */
  private initializeServices(): void {
    // Servicio dinámico para Ordenlaboratorio
    import('../../services/OrdenlaboratorioService')
      .then(module => {
        const serviceInstance = new module.OrdenlaboratorioService(this.httpClient);
        this.entityServicesMap.set('Ordenlaboratorio', serviceInstance);
      })
      .catch(error => console.error('Error loading service for Ordenlaboratorio:', error));

  }

  /**
   * Inicializa los atributos para cada entidad
   * Esto se hace para simular la obtención de los atributos de cada entidad
   */
  private initializeEntityAttributes(): void {
    // Atributos para la entidad Ordenlaboratorio
    this.entityAttributesMap.set('Ordenlaboratorio', [
      { name: 'id', type: 'long', selected: false },
      { name: 'nombre', type: 'String', selected: false },
      { name: 'record', type: 'String', selected: false },
      { name: 'rx', type: 'String', selected: false },
      { name: 'piezas', type: 'Integer', selected: false },
      { name: 'shade', type: 'String', selected: false },
      { name: 'lab', type: 'String', selected: false },
      { name: 'fechaEnvio', type: 'LocalDate', selected: false },
      { name: 'fechaEntrega', type: 'LocalDate', selected: false },
      { name: 'factura', type: 'String', selected: false },
      { name: 'monto', type: 'Double', selected: false },
      { name: 'pay', type: 'String', selected: false },
      { name: 'cheque', type: 'String', selected: false },
      { name: 'creador', type: 'String', selected: false },
    ]);

  }

  /**
   * Carga los atributos de la entidad seleccionada en la tabla
   * @param entityName Nombre de la entidad seleccionada
   */
  loadEntityAttributes(entityName: string): void {
    const attributes = this.entityAttributesMap.get(entityName) || [];
    
    // Actualizar estado de selección basado en selectedAttributes
    attributes.forEach(attr => {
      const isSelected = this.selectedAttributes.some(
        selected => selected.name === attr.name && (selected as any).entity === entityName
      );
      attr.selected = isSelected;
    });

    this.attributesDataSource.data = attributes;
    
    // Configurar paginador y ordenamiento después de que los datos están disponibles
    setTimeout(() => {
      if (this.paginator && this.sort) {
        this.attributesDataSource.paginator = this.paginator;
        this.attributesDataSource.sort = this.sort;
      }
    });
  }

  /**
   * Muestra un mensaje al usuario
   * @param message Mensaje a mostrar
   * @param type Tipo de mensaje (error o éxito)
   */
  private showMessage(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: type === 'error' ? ['error-snackbar'] : ['success-snackbar']
    });
  }

  /**
   * Resetea los atributos seleccionados y actualiza la UI
   */
  private resetSelectedAttributes(): void {
    // Limpiar el array de atributos seleccionados
    this.selectedAttributes = [];
    
    // Si hay una entidad seleccionada, actualizar los checkboxes en la tabla
    if (this.selectedEntity) {
      const attributes = this.entityAttributesMap.get(this.selectedEntity) || [];
      attributes.forEach(attr => attr.selected = false);
      this.attributesDataSource.data = [...attributes]; // Forzar actualización de la UI
    }
    
    // Mostrar mensaje de confirmación
    this.showMessage('Se han reiniciado los atributos seleccionados', 'success');
  }

  /**
   * Añade o remueve un atributo de la lista de seleccionados para el reporte
   * @param attribute Atributo a alternar su selección
   */
  toggleAttributeSelection(attribute: EntityAttribute): void {
    if (!this.selectedEntity) return;

    // Clonar el atributo y asociarlo con la entidad seleccionada
    const attributeWithEntity = {
      ...attribute,
      entity: this.selectedEntity
    };

    // Alternar el estado de selección
    attribute.selected = !attribute.selected;

    if (attribute.selected) {
      // Añadir a los seleccionados
      this.selectedAttributes.push(attributeWithEntity as any);
      this.showMessage(`Atributo ${attribute.name} añadido al reporte`, 'success');
    } else {
      // Eliminar de los seleccionados
      const index = this.selectedAttributes.findIndex(
        attr => attr.name === attribute.name && (attr as any).entity === this.selectedEntity
      );
      if (index >= 0) {
        this.selectedAttributes.splice(index, 1);
        this.showMessage(`Atributo ${attribute.name} eliminado del reporte`, 'success');
      }
    }
  }

  /**
   * Genera el reporte PDF con los atributos seleccionados
   */
  generateReport(): void {
    if (this.selectedAttributes.length === 0) {
      this.showMessage('No hay atributos seleccionados para el reporte', 'error');
      return;
    }

    this.isGeneratingReport = true;

    // Agrupar atributos por entidad para procesar los datos
    const attributesByEntity = this.selectedAttributes.reduce((acc, attr) => {
      const entity = (attr as any).entity || '';
      if (!acc[entity]) acc[entity] = [];
      acc[entity].push(attr);
      return acc;
    }, {} as Record<string, EntityAttribute[]>);

    // Para cada entidad, obtener los datos y generar un reporte
    const promises: Promise<any>[] = [];

    Object.entries(attributesByEntity).forEach(([entityName, attributes]) => {
      const service = this.entityServicesMap.get(entityName);
      if (service && service.findAll) {
        const promise = new Promise<any>((resolve, reject) => {
          service.findAll().subscribe({
            next: (data: any[]) => {
              console.log(`Datos recibidos para ${entityName}:`, data);
              if (!data || data.length === 0) {
                console.warn(`No hay datos para la entidad ${entityName}`);
              }
              resolve({
                entityName,
                attributes,
                data
              });
            },
            error: (error: any) => {
              console.error(`Error obteniendo datos para ${entityName}:`, error);
              reject(error);
            }
          });
        });
        promises.push(promise);
      } else {
        console.error(`No se encontró el servicio para ${entityName} o no tiene método findAll`);
      }
    });

    // Una vez que se han obtenido todos los datos, generar el PDF
    Promise.all(promises)
      .then(results => {
        this.generatePDF(results);
        this.isGeneratingReport = false;
        // Limpiar los atributos seleccionados después de generar el reporte
        this.resetSelectedAttributes();
      })
      .catch(error => {
        console.error('Error al obtener datos para el reporte:', error);
        this.showMessage('Error al generar el reporte', 'error');
        this.isGeneratingReport = false;
      });
  }

  /**
   * Genera un PDF con los datos obtenidos
   * @param results Resultados de las consultas por entidad
   */
  private generatePDF(results: any[]): void {
    // Crear documento PDF
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Para cada entidad, generar una sección en el PDF
    results.forEach((result, index) => {
      const { entityName, attributes, data } = result;

      // Si no es la primera página, añadir una nueva
      if (index > 0) {
        doc.addPage();
      }

      // Generar encabezado del reporte
      this.generateReportHeader(doc, entityName);

      // VALIDACIÓN 1: Si hay algún atributo TextArea, usar formato de clave-valor
     const hasTextArea = attributes.some((attr: EntityAttribute) => attr.isTextArea === true);
      if (hasTextArea) {
      // Si hay campos TextArea, usar siempre formato clave-valor
       this.generateKeyValueFormat(doc, data, attributes, entityName);
       }
      // VALIDACIÓN 2: Si no hay TextArea pero hay más de 4 atributos, usar formato de clave-valor
       else if (attributes.length > 5) {
        // Usar formato de clave-valor para más de 5 atributos
        this.generateKeyValueFormat(doc, data, attributes, entityName);
      } else {
      // VALIDACIÓN 3: Para 5 o menos atributos sin TextArea, usar formato de tabla
        const tableData = this.prepareTableData(data, attributes);
        const headers = attributes.map((attr: EntityAttribute) => ({ title: attr.name, dataKey: attr.name }));

        // Generar tabla con autoTable
        autoTable(doc, {
          head: [headers.map((h: { title: string }) => h.title)],
          body: tableData,
          startY: 50,
          margin: { top: 50 },
          styles: {
            fontSize: 8,
            cellPadding: 3,
            lineColor: [44, 62, 80],
            lineWidth: 0.25
          },
          headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: 'bold'
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245]
          },
          tableWidth: 'auto',
          columnStyles: {}
        });
      }
    });

    // Guardar el PDF
    const pdfName = results.length === 1 
      ? `Reporte_${results[0].entityName}_${this.datePipe.transform(new Date(), 'yyyyMMdd')}.pdf`
      : `Reporte_Multiple_${this.datePipe.transform(new Date(), 'yyyyMMdd')}.pdf`;

    doc.save(pdfName);
    this.showMessage('Reporte generado con éxito', 'success');
  }

  /**
   * Genera un formato de clave-valor para los datos en el PDF,
   * similar al formato mostrado en la imagen 1
   * @param doc Documento PDF
   * @param data Datos a mostrar
   * @param attributes Atributos seleccionados
   * @param entityName Nombre de la entidad
   */
  private generateKeyValueFormat(doc: jsPDF, data: any[], attributes: EntityAttribute[], entityName: string): void {
    if (!data || data.length === 0) {
      doc.setFontSize(12);
      doc.text('No hay datos disponibles para esta entidad', 15, 60);
      return;
    }

    let yPos = 50; // Posición inicial Y después del encabezado
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginBottom = pageHeight - 20; // Margen inferior
    const lineHeight = 7; // Altura de cada línea
    const leftMargin = 15; // Margen izquierdo
    const rightMargin = 15; // Margen derecho
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - leftMargin - rightMargin; // Ancho máximo para el texto
    const labelWidth = 80; // Ancho para las etiquetas (nombre del atributo)
    const valueXPos = leftMargin + labelWidth; // Posición X donde empiezan los valores
    const valueWidth = maxWidth - labelWidth; // Ancho máximo para los valores

    // Título de los registros
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Registros de ${entityName} (${data.length})`, leftMargin, yPos);
    yPos += 10;

    // Iterar sobre cada registro
    data.forEach((item, itemIndex) => {
      // Agregar número y título de registro
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`Registro #${itemIndex + 1}`, leftMargin, yPos);
      yPos += lineHeight;

      // Verificar si necesitamos una nueva página
      if (yPos > marginBottom) {
        doc.addPage();
        yPos = 20; // Reiniciar posición Y en nueva página
      }

      // Iterar sobre cada atributo del registro (formato clave-valor)
      attributes.forEach((attr, attrIndex) => {
        // Verificar si necesitamos una nueva página
        if (yPos > marginBottom) {
          doc.addPage();
          yPos = 20; // Reiniciar posición Y en nueva página
        }

        // Estilo para el nombre del atributo
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        
        // Obtener el valor del atributo
        try {
          const value = this.getAttributeValue(item, attr.name);
          const formattedValue = this.formatValueForReport(value, attr.type);
          
          // Nombre del atributo
          doc.text(`${attr.name}:`, leftMargin + 5, yPos);
          
          // Valor del atributo (con estilo normal)
          doc.setFont('helvetica', 'normal');
          
          // Detectar si es un texto largo (mayor a 50 caracteres o contiene saltos de línea)
          const isLongText = formattedValue && (formattedValue.length > 50 || formattedValue.includes('\n'));
          
          if (isLongText) {
            // Para textos largos, usar text con opciones de ajuste de texto (splitTextToSize)
            const textLines = doc.splitTextToSize(formattedValue || 'N/A', valueWidth);
            
            // Si hay muchas líneas, verificar si necesitamos nueva página
            if (yPos + (textLines.length * lineHeight) > marginBottom) {
              doc.addPage();
              yPos = 20;
              // Repetir el nombre del atributo en la nueva página
              doc.setFont('helvetica', 'bold');
              doc.text(`${attr.name}:`, leftMargin + 5, yPos);
              doc.setFont('helvetica', 'normal');
            }
            
            // Dibujar cada línea del texto
            textLines.forEach((line: string, index: number) => {
              const lineY = yPos + (index * lineHeight);
              doc.text(line, valueXPos, lineY);
            });
            
            // Actualizar la posición Y después del texto multilínea
            yPos += (textLines.length * lineHeight);
          } else {
            // Para textos cortos, mostrar en una sola línea
            doc.text(formattedValue || 'N/A', valueXPos, yPos);
            yPos += lineHeight;
          }
        } catch (error) {
          console.error(`Error obteniendo valor para ${attr.name}:`, error);
          doc.setFont('helvetica', 'normal');
          doc.text('Error', valueXPos, yPos);
          yPos += lineHeight;
        }
      });

      // Agregar línea separadora entre registros
      if (itemIndex < data.length - 1) {
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.line(leftMargin, yPos, pageWidth - leftMargin, yPos);
        yPos += 10; // Espacio después de la línea
        
        // Verificar si necesitamos una nueva página para el próximo registro
        if (yPos > marginBottom - 20) {
          doc.addPage();
          yPos = 20; // Reiniciar posición Y en nueva página
        }
      }
    });
  }

  /**
   * Busca la extensión del archivo de logo del proyecto
   * @returns Objeto con la ruta, extensión y el formato para jsPDF
   */
  private findLogoExtension(): { path: string, extension: string, format: string } {
    // Lista de extensiones posibles
    const logoExtensions = ['png', 'jpg', 'jpeg', 'webp', 'svg'];

    // Primero intentamos buscar el logo del proyecto
    for (const ext of logoExtensions) {
      // Crear objeto XMLHttpRequest para verificar si el archivo existe
      const xhr = new XMLHttpRequest();
      xhr.open('HEAD', `assets/images/logos/logoProyecto.${ext}`, false); // petición síncrona
      try {
        xhr.send();
        
        // Si el archivo existe (código 200), retornar esta extensión
        if (xhr.status === 200) {
          // Para jsPDF, el formato se escribe de manera específica
          let format = ext.toUpperCase();
          if (ext === 'jpg') format = 'JPEG';
          if (ext === 'svg') format = 'SVG';
          return { 
            path: `assets/images/logos/logoProyecto.${ext}`, 
            extension: ext, 
            format: format 
          };
        }
      } catch (error) {
        console.warn(`Error al verificar logoProyecto.${ext}:`, error);
      }
    }

    // Si no se encuentra el logo del proyecto, intentamos con el logo por defecto
    const xhr = new XMLHttpRequest();
    xhr.open('HEAD', 'assets/images/logos/logo-dark.png', false);
    try {
      xhr.send();
      if (xhr.status === 200) {
        return { 
          path: 'assets/images/logos/logo-dark.png', 
          extension: 'png', 
          format: 'PNG' 
        };
      }
    } catch (error) {
      console.warn('Error al verificar logo-dark.png:', error);
    }

    // Si tampoco se encuentra el logo por defecto, devolvemos un objeto con valores para evitar errores
    console.warn('No se encontró ningún logo. Se usará una representación de texto.');
    return { 
      path: '', 
      extension: 'none', 
      format: 'NONE' 
    };
  }

  /**
   * Genera el encabezado del reporte con logo, título y fecha
   * @param doc Documento PDF
   * @param entityName Nombre de la entidad
   */
  private generateReportHeader(doc: jsPDF, entityName: string): void {
    const pageWidth = doc.internal.pageSize.getWidth();

    // Cargar logo desde la ruta definida
    const logoInfo = this.findLogoExtension();
    
    if (logoInfo.extension !== 'none') {
      // Si se encontró algún logo, añadirlo al PDF
      const logoWidth = 40;
      const logoHeight = 20;
      try {
        doc.addImage(logoInfo.path, logoInfo.format, 15, 15, logoWidth, logoHeight);
      } catch (error) {
        console.error('Error al añadir la imagen al PDF:', error);
        // Si hay error al añadir la imagen, añadimos un texto alternativo
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text('Logo no disponible', 15, 25);
      }
    } else {
      // Si no se encontró ningún logo, añadimos un texto alternativo
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text('Logo no disponible', 15, 25);
    }

    // Título del reporte
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Reporte de ${entityName}`, pageWidth / 2, 20, { align: 'center' });

    // Fecha del reporte
    const currentDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha de creación: ${currentDate}`, pageWidth - 15, 20, { align: 'right' });

    // Línea separadora
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(15, 40, pageWidth - 15, 40);
  }

  /**
   * Prepara los datos para la tabla del reporte
   * @param data Datos obtenidos de la entidad
   * @param attributes Atributos seleccionados para el reporte
   * @returns Array con los datos formateados para la tabla
   */
  private prepareTableData(data: any[], attributes: EntityAttribute[]): any[] {
    console.log('Datos originales:', data);
    if (!data || data.length === 0) {
      console.warn('No hay datos para mostrar en la tabla');
      return [["No hay datos disponibles"]];
    }
    // Convertir los datos a un formato que autoTable pueda entender
    return data.map(item => {
      //En lugar de un objeto, crear un ARRAY de valores en el mismo orden que los headers
      return attributes.map(attr => {
        try {
          // Obtener el valor del atributo
          const value = this.getAttributeValue(item, attr.name);
          // Formatear el valor según el tipo
          return this.formatValueForReport(value, attr.type);
        } catch (error) {
          console.error(`Error procesando atributo ${attr.name}:`, error);
          return 'Error';
        }
      });
    });
  }

  /**
   * Obtiene el valor de un atributo del objeto, incluso si es una propiedad anidada
   * @param item Objeto del que se extrae el valor
   * @param attributeName Nombre del atributo
   * @returns Valor del atributo
   */
  private getAttributeValue(item: any, attributeName: string): any {
    if (!item) {
      console.warn(`Item es null o undefined al buscar ${attributeName}`);
      return null;
    }
    // Si el atributo tiene notación de punto (ej: 'usuario.nombre'), acceder recursivamente
    if (attributeName.includes('.')) {
      const parts = attributeName.split('.');
      let value = item;
      
      for (const part of parts) {
        if (value === null || value === undefined) {
          return 'N/A';
        }
        value = value[part];
      }
      
      return value;
    }
    
    // Para casos simples, retornar directamente el valor
    return item[attributeName];
  }

  /**
   * Formatea un valor según su tipo para mostrarlo en el reporte
   * Versión mejorada para manejar relaciones entre entidades
   * @param value Valor a formatear
   * @param type Tipo de dato
   * @returns Valor formateado
   */
  private formatValueForReport(value: any, type: string): string {
    if (value === null || value === undefined) {
      return 'N/A';
    }

    // Formatear según el tipo
    switch (type) {
      case 'Date':
      case 'LocalDate':
        try {
          return this.datePipe.transform(value, 'dd/MM/yyyy') || 'N/A';
        } catch {
          return value.toString();
        }
      case 'LocalDateTime':
        try {
          return this.datePipe.transform(value, 'dd/MM/yyyy HH:mm') || 'N/A';
        } catch {
          return value.toString();
        }
      case 'Double':
      case 'Float':
        return typeof value === 'number' ? value.toFixed(2) : value.toString();
      case 'Boolean':
        return value ? 'Sí' : 'No';
      default:
        // Si es un objeto, intentar obtener una representación legible
        if (typeof value === 'object') {
          // Manejar arrays (típicamente relaciones ManyToMany)
          if (Array.isArray(value)) {
            if (value.length === 0) return '[]';
            
            // Obtener un valor representativo para cada elemento del array
            const displayValues = value.map(item => this.getDisplayValueForRelationship(item));
            
            // Unir los valores con comas limitando a máximo 5 elementos para no sobrecargar el reporte
            if (value.length <= 5) {
              return displayValues.join(', ');
            } else {
              // Si hay más de 5 elementos, mostrar los primeros 5 y añadir indicación de más
              return displayValues.slice(0, 5).join(', ') + ` y ${value.length - 5} más`;
            }
          } else if (value !== null) {
            // Para objetos individuales (típicamente relaciones ManyToOne o OneToOne)
            return this.getDisplayValueForRelationship(value);
          }
        }
        return String(value);
    }
  }

  /**
   * Obtiene un valor representativo para un objeto que representa una relación
   * Busca atributos comunes como nombre, descripción, código, etc.
   * antes de recurrir al ID
   * @param obj Objeto de relación
   * @returns Valor representativo como string
   */
  private getDisplayValueForRelationship(obj: any): string {
    if (!obj) return 'N/A';
    
    // Lista priorizada de posibles atributos a mostrar
    const priorityAttributes = [
      'nombre', 'name', 
      'descripcion', 'description', 
      'codigo', 'code',
      'titulo', 'title',
      'valor', 'value',
      'referencia', 'reference',
      'identificador', 'identifier',
      'texto', 'text',
      'etiqueta', 'label',
      'detalle', 'detail'
    ];
    
    // Primero intentar con atributos prioritarios
    for (const attr of priorityAttributes) {
      if (obj[attr] !== undefined && obj[attr] !== null) {
        return String(obj[attr]);
      }
    }
    
    // Si no hay atributos prioritarios, buscar el primer atributo que no sea id y no sea un objeto
    const keys = Object.keys(obj).filter(key => 
      key.toLowerCase() !== 'id' && 
      !key.toLowerCase().endsWith('id') && 
      typeof obj[key] !== 'object' &&
      typeof obj[key] !== 'function'
    );
    
    if (keys.length > 0) {
      return String(obj[keys[0]]);
    }
    
    // Si hay un ID, usarlo como último recurso
    if (obj.id !== undefined) {
      return `ID: ${obj.id}`;
    }
    
    // Si todo falla, convertir a JSON
    return JSON.stringify(obj);
  }
}
