// @ts-ignore
import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';
// @ts-ignore
import { MatPaginator } from '@angular/material/paginator';

/**
 * Clase Utilities
 *
 * Contiene una colección de métodos estáticos para facilitar tareas comunes en el frontend,
 * incluyendo formateo visual, validaciones de formularios y utilidades generales.
 *
 * Esta clase está diseñada para ser utilizada en conjunto con el código generado automáticamente
 * por Coddi, permitiendo a los desarrolladores implementar rápidamente mejoras y personalizaciones.
 */
export class Utilities {

  /**
   * =====================================================================
   * MÉTODOS DE FORMATEO VISUAL PARA TABLAS
   * =====================================================================
   */

  /**
   * Formatea una fecha para mostrarla en una tabla
   * @param value Valor de fecha a formatear (puede ser Date, string, o timestamp)
   * @param format Formato de fecha (por defecto: 'dd/MM/yyyy')
   * @returns Fecha formateada como string o 'N/A' si es null/undefined
   */
  static formatDate(value: any, format: string = 'dd/MM/yyyy'): string {
    if (value === null || value === undefined) {
      return 'N/A';
    }

    try {
      const date = new Date(value);

      // Verificar si la fecha es válida
      if (isNaN(date.getTime())) {
        return 'Fecha inválida';
      }

      // Formatear según el formato especificado
      if (format === 'dd/MM/yyyy') {
        return date.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      } else if (format === 'dd/MM/yyyy HH:mm') {
        return date.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } else {
        // Formato personalizado simple
        return date.toLocaleDateString('es-ES');
      }
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Error de formato';
    }
  }

  /**
   * Formatea un valor monetario para mostrar en una tabla
   * @param value Valor numérico a formatear
   * @param currency Símbolo de moneda (por defecto: '$')
   * @param decimals Número de decimales (por defecto: 2)
   * @returns Valor monetario formateado o 'N/A' si es null/undefined
   */
  static formatCurrency(value: any, currency: string = '$', decimals: number = 2): string {
    if (value === null || value === undefined) {
      return 'N/A';
    }

    const numValue = parseFloat(value);

    if (isNaN(numValue)) {
      return 'Valor inválido';
    }

    try {
      return currency + ' ' + numValue.toLocaleString('es-ES', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });
    } catch (error) {
      console.error('Error al formatear moneda:', error);
      return 'Error de formato';
    }
  }

  /**
   * Formatea un valor porcentual para mostrar en una tabla
   * @param value Valor a formatear como porcentaje (ej: 0.25 para 25%)
   * @param decimals Número de decimales (por defecto: 2)
   * @returns Porcentaje formateado o 'N/A' si es null/undefined
   */
  static formatPercentage(value: any, decimals: number = 2): string {
    if (value === null || value === undefined) {
      return 'N/A';
    }

    const numValue = parseFloat(value);

    if (isNaN(numValue)) {
      return 'Valor inválido';
    }

    try {
      // Multiplicar por 100 si el valor está en formato decimal (0-1)
      const percentage = numValue <= 1 ? numValue * 100 : numValue;

      return percentage.toFixed(decimals) + '%';
    } catch (error) {
      console.error('Error al formatear porcentaje:', error);
      return 'Error de formato';
    }
  }

  /**
   * Formatea un valor booleano para mostrar en una tabla
   * @param value Valor booleano a formatear
   * @param trueText Texto a mostrar si es verdadero (por defecto: 'Sí')
   * @param falseText Texto a mostrar si es falso (por defecto: 'No')
   * @returns Texto formateado según el valor booleano o 'N/A' si es null/undefined
   */
  static formatBoolean(value: any, trueText: string = 'Sí', falseText: string = 'No'): string {
    if (value === null || value === undefined) {
      return 'N/A';
    }

    // Considerar 'true', 'yes', 'si', 'sí', 1 como valores verdaderos
    if (value === true ||
      value === 1 ||
      value === '1' ||
      (typeof value === 'string' && ['true', 'yes', 'si', 'sí'].includes(value.toLowerCase()))) {
      return trueText;
    } else {
      return falseText;
    }
  }

  /**
   * Formatea un valor de estado para mostrar en una tabla con un texto coloreado
   * @param value Valor de estado
   * @param statusMap Mapa de estados a textos y colores
   * @returns HTML con el texto coloreado según el estado o 'N/A' si es null/undefined
   */
  static formatStatus(value: any, statusMap: Record<string, { text: string, color: string }>): string {
    if (value === null || value === undefined) {
      return 'N/A';
    }

    const valueStr = String(value).toLowerCase();

    if (statusMap[valueStr]) {
      const {text, color} = statusMap[valueStr];
      return `<span style="color: ${color}; font-weight: bold;">${text}</span>`;
    } else {
      return String(value);
    }
  }

  /**
   * Trunca un texto largo para mostrar en una tabla
   * @param text Texto a truncar
   * @param maxLength Longitud máxima (por defecto: 50)
   * @returns Texto truncado con "..." o el texto original si es más corto
   */
  static truncateText(text: any, maxLength: number = 50): string {
    if (text === null || text === undefined) {
      return 'N/A';
    }

    const textStr = String(text);

    if (textStr.length <= maxLength) {
      return textStr;
    } else {
      return textStr.substring(0, maxLength - 3) + '...';
    }
  }

  /**
   * Obtiene un valor legible de un objeto relación
   * @param relationObject Objeto de relación (ej: {id: 1, nombre: 'Cliente 1'})
   * @param displayField Campo a mostrar (por defecto: 'nombre')
   * @returns Valor del campo especificado o representación alternativa
   */
  static formatRelationObject(relationObject: any, displayField: string = 'nombre'): string {
    if (!relationObject) {
      return 'N/A';
    }

    // Si es un número o string simple, devolverlo directamente
    if (typeof relationObject !== 'object') {
      return String(relationObject);
    }

    // Campos comunes para mostrar, en orden de prioridad
    const commonFields = [
      displayField, 'name', 'nombre', 'descripcion', 'description',
      'titulo', 'title', 'referencia', 'reference', 'codigo', 'code'
    ];

    // Buscar el primer campo disponible
    for (const field of commonFields) {
      if (relationObject[field] !== undefined && relationObject[field] !== null) {
        return String(relationObject[field]);
      }
    }

    // Si tiene ID pero ningún otro campo encontrado
    if (relationObject.id !== undefined) {
      return `ID: ${relationObject.id}`;
    }

    // Si todo lo demás falla, devolver una representación JSON
    try {
      return JSON.stringify(relationObject);
    } catch (e) {
      return 'Objeto complejo';
    }
  }


  /**
   * Formatea un número con decimales para mostrar en una tabla
   * @param value Valor numérico a formatear
   * @param decimals Número de decimales (por defecto: 2)
   * @returns Número formateado o 'N/A' si es null/undefined
   */
  static formatNumberWithDecimals(value: any, decimals: number = 2): string {
    if (value === null || value === undefined) {
      return 'N/A';
    }

    const numValue = parseFloat(value);

    if (isNaN(numValue)) {
      return 'Valor inválido';
    }

    try {
      return numValue.toLocaleString('es-ES', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });
    } catch (error) {
      console.error('Error al formatear número:', error);
      return 'Error de formato';
    }
  }

  /**
   * Personaliza el paginador de Angular Material para mostrarlo en español
   * @param paginator Instancia del paginador a personalizar
   */
  static customizeMatPaginator(paginator: MatPaginator): void {
    paginator._intl.itemsPerPageLabel = 'Elementos por página:';
    paginator._intl.nextPageLabel = 'Página siguiente';
    paginator._intl.previousPageLabel = 'Página anterior';
    paginator._intl.firstPageLabel = 'Primera página';
    paginator._intl.lastPageLabel = 'Última página';
    paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return `0 de ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex = startIndex < length ?
        Math.min(startIndex + pageSize, length) :
        startIndex + pageSize;
      return `${startIndex + 1} - ${endIndex} de ${length}`;
    };
  }


  /**
   * =====================================================================
   * MÉTODOS DE FORMATEO VISUAL PARA FORMULARIOS
   * =====================================================================
   */

  /**
   * Formatea un valor de fecha para mostrar en un campo de formulario
   * @param value Fecha a formatear
   * @param format Formato a aplicar (opcional)
   * @returns String formateado para mostrar
   */
  static formatDateForForm(value: any, format: string = 'dd/MM/yyyy'): string {
    if (!value) {
      return '';
    }

    try {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return '';
      }

      // Formatos comunes
      if (format === 'dd/MM/yyyy') {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      } else if (format === 'yyyy-MM-dd') {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
      }

      // Formato para input type="date"
      if (format === 'input') {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
      }

      return date.toLocaleDateString();
    } catch (error) {
      console.error('Error al formatear fecha para formulario:', error);
      return '';
    }
  }

  /**
   * Formatea un número para mostrar en un campo de formulario
   * @param value Valor a formatear
   * @param decimals Número de decimales (por defecto: 0)
   * @returns String formateado para mostrar
   */
  static formatNumberForForm(value: any, decimals: number = 0): string {
    if (value === null || value === undefined || value === '') {
      return '';
    }

    try {
      const num = parseFloat(value);
      if (isNaN(num)) {
        return '';
      }

      return num.toFixed(decimals);
    } catch (error) {
      console.error('Error al formatear número para formulario:', error);
      return '';
    }
  }

  /**
   * Formatea un teléfono para mostrar en un campo de formulario
   * @param value Valor a formatear
   * @param countryCode Código de país (por defecto: 'CO' para Colombia)
   * @returns String formateado para mostrar
   */
  static formatPhoneForForm(value: any, countryCode: string = 'CO'): string {
    if (!value) {
      return '';
    }

    // Limpiamos el número de caracteres no numéricos excepto el +
    const cleaned = String(value).replace(/[^\d+]/g, '');

    // Formateo según el país
    switch (countryCode) {
      case 'CO': // Colombia
        // Si ya tiene el código +57, lo dejamos
        if (cleaned.startsWith('+57')) {
          return cleaned;
        }

        // Si empieza con +, no agregamos el código
        if (cleaned.startsWith('+')) {
          return cleaned;
        }

        // Si tiene 10 dígitos (número local colombiano)
        if (cleaned.length === 10) {
          return `+57${cleaned}`;
        }

        return cleaned;

      case 'ES': // España
        // Lógica similar para España
        if (cleaned.startsWith('+34')) {
          return cleaned;
        }

        if (cleaned.startsWith('+')) {
          return cleaned;
        }

        if (cleaned.length === 9) {
          return `+34${cleaned}`;
        }

        return cleaned;

      default:
        return cleaned;
    }
  }

  /**
   * Formatea una dirección de correo para mostrar en un campo de formulario
   * @param value Valor a formatear
   * @returns String formateado para mostrar
   */
  static formatEmailForForm(value: any): string {
    if (!value) {
      return '';
    }

    // Simplemente devolvemos el valor en minúsculas y sin espacios
    return String(value).trim().toLowerCase();
  }

  /**
   * Formatea una dirección para mostrar en un campo de formulario
   * @param value Dirección a formatear
   * @returns String formateado para mostrar
   */
  static formatAddressForForm(value: any): string {
    if (!value) {
      return '';
    }

    // Eliminar dobles espacios y formatear con la primera letra en mayúscula
    const trimmed = String(value).trim().replace(/\s+/g, ' ');
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  }

  /**
   * Formatea un nombre para mostrar en un campo de formulario
   * @param value Nombre a formatear
   * @returns String formateado para mostrar
   */
  static formatNameForForm(value: any): string {
    if (!value) {
      return '';
    }

    // Eliminar dobles espacios
    const trimmed = String(value).trim().replace(/\s+/g, ' ');

    // Convertir a formato título (primera letra de cada palabra en mayúscula)
    return trimmed.split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
  }

  /**
   * Formatea un valor monetario para mostrar en un campo de formulario
   * @param value Valor a formatear
   * @param decimals Número de decimales (por defecto: 2)
   * @returns String formateado para mostrar
   */
  static formatCurrencyForForm(value: any, decimals: number = 2): string {
    if (value === null || value === undefined || value === '') {
      return '';
    }

    try {
      const num = parseFloat(value);
      if (isNaN(num)) {
        return '';
      }

      return num.toFixed(decimals);
    } catch (error) {
      console.error('Error al formatear moneda para formulario:', error);
      return '';
    }
  }

  /**
   * Formatea un objeto de relación para mostrar en un campo de formulario
   * @param value Objeto a formatear
   * @param displayField Campo a mostrar (por defecto: 'nombre')
   * @returns String formateado o ID si no se encuentra el campo
   */
  static formatRelationForForm(value: any, displayField: string = 'nombre'): any {
    if (!value) {
      return null;
    }

    // Si es solo un ID, lo devolvemos como está
    if (typeof value !== 'object') {
      return value;
    }

    // Si es un objeto con ID, devolvemos el ID
    if (value.id !== undefined) {
      return value.id;
    }

    return null;
  }

  /**
   * Formatea un número añadiendo separador de miles (punto)
   * @param value Valor a formatear
   * @param decimals Número de decimales (por defecto: 0)
   * @param decimalSeparator Separador decimal (por defecto: ',')
   * @param thousandSeparator Separador de miles (por defecto: '.')
   * @returns String formateado con separador de miles
   */
  static formatNumberWithThousandSeparator(
    value: any,
    decimals: number = 0,
    decimalSeparator: string = ',',
    thousandSeparator: string = '.'
  ): string {
    if (value === null || value === undefined || value === '') {
      return '';
    }

    try {
      // Convertir a número y manejar posibles errores
      let numValue: number;
      if (typeof value === 'string') {
        // Reemplazar comas por puntos para el cálculo
        numValue = parseFloat(value.replace(',', '.'));
      } else {
        numValue = Number(value);
      }

      if (isNaN(numValue)) {
        return '';
      }

      // Formatear con decimales específicos
      const fixedValue = numValue.toFixed(decimals);

      // Separar parte entera y decimal
      const parts = fixedValue.split('.');

      // Formatear parte entera con separadores de miles
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);

      // Unir con el separador decimal elegido
      return decimals > 0
        ? parts.join(decimalSeparator)
        : parts[0];
    } catch (error) {
      console.error('Error al formatear número con separador de miles:', error);
      return '';
    }
  }


  /**
   * Formatea un número de documento para mostrar en un formulario
   * @param documentNumber Número de documento a formatear
   * @returns Número de documento formateado
   */
  static formatDocumentForForm(documentNumber: string): string {
    if (!documentNumber) return '';

    // Eliminar cualquier carácter que no sea un número
    return documentNumber.replace(/\D/g, '');
  }

  /**
   * Formatea un placeholder para un campo de formulario
   * @param fieldName Nombre del campo
   * @param type Tipo de campo (por defecto: 'input')
   * @returns Placeholder formateado
   */
  static formatPlaceholder(fieldName: string, type: string = 'input'): string {
    if (!fieldName) return '';

    // Convertir en formato "Nombre de Campo" (primera letra mayúscula, resto minúsculas)
    const formattedName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1).toLowerCase();

    if (type === 'select') {
      return `Seleccione ${formattedName.toLowerCase()}`;
    } else if (type === 'datepicker') {
      return `Seleccione ${formattedName.toLowerCase()}`;
    } else {
      return `Ingrese ${formattedName.toLowerCase()}`;
    }
  }

  /**
   * =====================================================================
   * VALIDACIONES PARA FORMULARIOS
   * =====================================================================
   */

  /**
   * Validador para verificar que una contraseña cumpla con los requisitos mínimos
   * @param minLength Longitud mínima (por defecto: 8)
   * @returns Validador para controlar la fortaleza de la contraseña
   */
  static passwordValidator(minLength: number = 8): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control || !control.value) {
        return null;
      }
      const value = control.value;
      // Validar longitud mínima
      if (value.length < minLength) {
        return {'passwordTooShort': {requiredLength: minLength, actualLength: value.length}};
      }

      // Verificar presencia de al menos un número
      if (!/\d/.test(value)) {
        return {'passwordNoNumbers': true};
      }
      // Verificar presencia de al menos una letra mayúscula
      if (!/[A-Z]/.test(value)) {
        return {'passwordNoUppercase': true};
      }
      // Verificar presencia de al menos una letra minúscula
      if (!/[a-z]/.test(value)) {
        return {'passwordNoLowercase': true};
      }

      // Verificar presencia de al menos un carácter especial
      if (!/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/.test(value)) {
        return {'passwordNoSpecialChars': true};
      }

      // Todo está bien
      return null;
    };
  }

  /**
   * Validador para verificar que los valores de dos campos coincidan (ej: contraseña y confirmación)
   * @param controlName Nombre del primer control
   * @param matchingControlName Nombre del control con el que debe coincidir
   * @returns Validador para verificar coincidencia entre campos
   */
  static matchValidator(controlName: string, matchingControlName: string): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: any } | null => {
      if (!(formGroup instanceof FormGroup)) {
        return null;
      }

      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (!control || !matchingControl) {
        return null;
      }

      // Si el control de coincidencia ya tiene errores, no añadir más
      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return null;
      }

      // Establecer error en el control de coincidencia si la validación falla
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({mustMatch: true});
        return {mustMatch: true};
      } else {
        matchingControl.setErrors(null);
        return null;
      }
    };
  }

  /**
   * Validador para verificar que un string contenga solo letras (y opcionalmente espacios)
   * @param allowSpaces Permitir espacios (por defecto: true)
   * @returns Validador para verificar que solo contenga letras
   */
  static onlyLettersValidator(allowSpaces: boolean = true): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control || !control.value) {
        return null;
      }

      const value = control.value;
      const pattern = allowSpaces ? /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]*$/ : /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]*$/;

      if (!pattern.test(value)) {
        return {'onlyLetters': {allowSpaces}};
      }

      return null;
    };
  }

  /**
   * Validador para verificar que un string contenga solo números (y opcionalmente punto o coma decimal)
   * @param allowDecimal Permitir punto o coma decimal (por defecto: true)
   * @returns Validador para verificar que solo contenga números
   */
  static onlyNumbersValidator(allowDecimal: boolean = true): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control || !control.value) {
        return null;
      }

      const value = control.value;
      const pattern = allowDecimal ? /^[0-9,.]*$/ : /^[0-9]*$/;

      if (!pattern.test(value)) {
        return {'onlyNumbers': {allowDecimal}};
      }

      return null;
    };
  }

  /**
   * Validador para verificar que un string contenga un email válido
   * @returns Validador para email
   */
  static emailValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control || !control.value) {
        return null;
      }

      const value = control.value;
      const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!pattern.test(value)) {
        return {'invalidEmail': true};
      }

      return null;
    };
  }

  /**
   * Validador para verificar que un string contenga un URL válido
   * @returns Validador para URL
   */
  static urlValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control || !control.value) {
        return null;
      }
      const value = control.value;
      const pattern = /^(https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(:[0-9]+)?(\/[^\s]*)?$/;
      if (!pattern.test(value)) {
        return {'invalidUrl': true};
      }
      return null;
    };
  }

  /**
   * Validador para verificar que un valor sea una fecha válida
   * @returns Validador para fechas
   */
  static dateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control || !control.value) {
        return null;
      }

      const value = control.value;

      // Si es un objeto Date válido
      if (value instanceof Date && !isNaN(value.getTime())) {
        return null;
      }

      // Si es un string, intentar convertirlo a Date
      if (typeof value === 'string') {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return null;
        }
      }

      return {'invalidDate': true};
    };
  }

  /**
   * Validador para verificar que un string contenga un número de teléfono válido
   * @param countryCode Código de país (por defecto: 'ES' para España)
   * @returns Validador para números de teléfono
   */
  static phoneValidator(countryCode: string = 'ES'): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control || !control.value) {
        return null;
      }

      const value = control.value;
      let pattern: RegExp;

      // Patrones por país (extender según necesidades)
      switch (countryCode) {
        case 'ES': // España: 9 dígitos, puede comenzar con +34 o 0034
          pattern = /^(\+34|0034|34)?[6789]\d{8}$/;
          break;
        case 'MX': // México: 10 dígitos, puede comenzar con +52 o 0052
          pattern = /^(\+52|0052|52)?[1-9]\d{9}$/;
          break;
        case 'CO': // Colombia: 10 dígitos, puede comenzar con +57 o 0057
          pattern = /^(\+57|0057|57)?[3]\d{9}$/;
          break;
        case 'AR': // Argentina: 10 dígitos, puede comenzar con +54 o 0054
          pattern = /^(\+54|0054|54)?[11|15]\d{8}$/;
          break;
        default: // Patrón genérico: entre 7 y 15 dígitos, puede tener prefijo internacional
          pattern = /^(\+\d{1,3}|\d{1,4})?\d{7,15}$/;
      }

      if (!pattern.test(value)) {
        return {'invalidPhone': {countryCode}};
      }

      return null;
    };
  }

  /**
   * Validador para verificar rango numérico
   * @param min Valor mínimo
   * @param max Valor máximo
   * @returns Validador para rango numérico
   */
  static rangeValidator(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control || !control.value) {
        return null;
      }
      const value = parseFloat(control.value);
      if (isNaN(value)) {
        return {'notANumber': true};
      }
      if (value < min) {
        return {'rangeUnderflow': {min, actual: value}};
      }
      if (value > max) {
        return {'rangeOverflow': {max, actual: value}};
      }
      return null;
    };
  }

  /**
   * =====================================================================
   * MÉTODOS ADICIONALES DE UTILIDAD
   * =====================================================================
   */
  /**
   * Obtiene una propiedad anidada de un objeto usando notación de punto
   * @param obj Objeto del que obtener la propiedad
   * @param path Ruta a la propiedad, usando notación de punto
   * @returns Valor de la propiedad o undefined si no existe
   */
  static getNestedProperty(obj: any, path: string): any {
    if (!obj || !path) return undefined;

    const parts = path.split('.');
    let value = obj;

    for (const part of parts) {
      if (value === null || value === undefined) return undefined;
      value = value[part];
    }

    return value;
  }

  /**
   * Convierte un array de datos a formato de tabla HTML
   * @param data Array de objetos con los datos
   * @param columns Columnas a incluir
   * @param options Opciones adicionales (clases CSS, formateo, etc.)
   * @returns Código HTML de la tabla
   */
  static arrayToHtmlTable(
    data: any[],
    columns?: string[],
    options?: {
      tableClass?: string;
      theadClass?: string;
      tbodyClass?: string;
      formatters?: Record<string, (value: any) => string>;
      headers?: Record<string, string>;
    }
  ): string {
    if (!data || data.length === 0) {
      return '<p>No hay datos disponibles</p>';
    }

    // Si no se especifican columnas, usar todas las propiedades del primer objeto
    if (!columns || columns.length === 0) {
      columns = Object.keys(data[0]);
    }

    // Iniciar la tabla
    let html = `<table class="${options?.tableClass || 'table table-bordered'}">\n`;

    // Cabecera
    html += `<thead class="${options?.theadClass || ''}">\n<tr>\n`;

    // Columnas para la cabecera
    for (const column of columns) {
      // Usar nombre personalizado si está definido en options.headers, de lo contrario usar el nombre de la columna
      const headerText = options?.headers?.[column] || column;
      html += `<th>${headerText}</th>\n`;
    }

    html += '</tr>\n</thead>\n';

    // Cuerpo de la tabla
    html += `<tbody class="${options?.tbodyClass || ''}">\n`;

    // Filas de datos
    for (const row of data) {
      html += '<tr>\n';

      for (const column of columns!) {
        const value = this.getNestedProperty(row, column);

        // Aplicar formateador si existe para esta columna
        let formattedValue = value;
        if (options?.formatters && options.formatters[column]) {
          formattedValue = options.formatters[column](value);
        } else if (value === null || value === undefined) {
          formattedValue = 'N/A';
        } else if (typeof value === 'object') {
          formattedValue = this.formatRelationObject(value);
        }

        html += `<td>${formattedValue}</td>\n`;
      }

      html += '</tr>\n';
    }

    html += '</tbody>\n</table>';

    return html;
  }

  /**
   * Convierte datos a formato CSV
   * @param data Array de objetos con los datos
   * @param columns Columnas a incluir
   * @param includeHeader Incluir cabecera con nombres de columnas
   * @returns String en formato CSV
   */
  static arrayToCsv(data: any[], columns?: string[], includeHeader: boolean = true): string {
    if (!data || data.length === 0) {
      return '';
    }

    // Si no se especifican columnas, usar todas las propiedades del primer objeto
    if (!columns || columns.length === 0) {
      columns = Object.keys(data[0]);
    }

    let csv = '';

    // Cabecera
    if (includeHeader) {
      csv += columns.map(column => `"${column}"`).join(',') + '\n';
    }

    // Filas de datos
    for (const row of data) {
      const values = columns!.map(column => {
        const value = this.getNestedProperty(row, column);

        // Formatear según el tipo de dato
        if (value === null || value === undefined) {
          return '""';
        } else if (typeof value === 'object') {
          return `"${this.formatRelationObject(value)}"`;
        } else {
          // Escapar comillas y poner entre comillas
          return `"${String(value).replace(/"/g, '""')}"`;
        }
      });

      csv += values.join(',') + '\n';
    }

    return csv;
  }

  /**
   * Descarga una tabla como archivo CSV
   * @param data Array de objetos con los datos
   * @param fileName Nombre del archivo (sin extensión)
   * @param columns Columnas a incluir
   */
  static downloadAsCsv(data: any[], fileName: string = 'download', columns?: string[]): void {
    const csv = this.arrayToCsv(data, columns);
    this.downloadFile(csv, `${fileName}.csv`, 'text/csv;charset=utf-8;');
  }

  /**
   * Descarga un archivo en el navegador
   * @param content Contenido del archivo
   * @param fileName Nombre del archivo
   * @param contentType Tipo de contenido
   */
  static downloadFile(content: string, fileName: string, contentType: string): void {
    const a = document.createElement('a');
    const file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  /**
   * Copia texto al portapapeles
   * @param text Texto a copiar
   * @returns Promise que se resuelve cuando se ha copiado el texto
   */
  static copyToClipboard(text: string): Promise<void> {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }

    // Fallback para navegadores que no soportan clipboard API
    return new Promise((resolve, reject) => {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Convierte una ruta de un archivo a solo el nombre del archivo
   * @param filePath Ruta completa del archivo
   * @returns Nombre del archivo sin la ruta
   */
  static getFileNameFromPath(filePath: string): string {
    if (!filePath) return '';

    // Manejar tanto separadores de Windows como Unix
    const parts = filePath.split(/[\\/]/);
    return parts[parts.length - 1];
  }

  /**
   * Obtiene la extensión de un archivo
   * @param fileName Nombre del archivo
   * @returns Extensión del archivo sin el punto
   */
  static getFileExtension(fileName: string): string {
    if (!fileName) return '';

    const parts = fileName.split('.');
    if (parts.length === 1) return '';

    return parts[parts.length - 1].toLowerCase();
  }

  /**
   * Verifica si un archivo es una imagen según su extensión
   * @param fileName Nombre del archivo
   * @returns true si es una imagen
   */
  static isImageFile(fileName: string): boolean {
    if (!fileName) return false;

    const extension = this.getFileExtension(fileName);
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];

    return imageExtensions.includes(extension);
  }

  /**
   * Verifica si un archivo es un documento según su extensión
   * @param fileName Nombre del archivo
   * @returns true si es un documento
   */
  static isDocumentFile(fileName: string): boolean {
    if (!fileName) return false;

    const extension = this.getFileExtension(fileName);
    const docExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'odt', 'ods', 'odp'];

    return docExtensions.includes(extension);
  }

  /**
   * Renderiza un icono según el tipo de archivo
   * @param fileName Nombre del archivo
   * @returns Código HTML con el icono adecuado
   */
  static getFileIconHtml(fileName: string): string {
    const extension = this.getFileExtension(fileName);
    let icon = '';

    // Iconos para diferentes tipos de archivos
    if (this.isImageFile(fileName)) {
      icon = '<i class="material-icons">image</i>';
    } else if (['pdf'].includes(extension)) {
      icon = '<i class="material-icons">picture_as_pdf</i>';
    } else if (['doc', 'docx', 'odt', 'rtf', 'txt'].includes(extension)) {
      icon = '<i class="material-icons">description</i>';
    } else if (['xls', 'xlsx', 'ods', 'csv'].includes(extension)) {
      icon = '<i class="material-icons">table_chart</i>';
    } else if (['ppt', 'pptx', 'odp'].includes(extension)) {
      icon = '<i class="material-icons">slideshow</i>';
    } else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
      icon = '<i class="material-icons">archive</i>';
    } else {
      icon = '<i class="material-icons">insert_drive_file</i>';
    }

    return icon;
  }

  /**
   * Formatea un nombre en formato título (primera letra de cada palabra en mayúscula)
   * @param name Nombre a formatear
   * @returns Nombre formateado
   */
  static formatNameToTitleCase(name: string): string {
    if (!name) return '';

    // Separar por espacios, guiones o guiones bajos
    return name
      .split(/[\s-_]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Convierte un texto en formato camelCase
   * @param text Texto a convertir
   * @returns Texto en camelCase
   */
  static toCamelCase(text: string): string {
    if (!text) return '';

    // Primero convertir a minúsculas y eliminar caracteres especiales
    let result = text.toLowerCase().replace(/[^\w\s\-_]/g, '');

    // Reemplazar espacios, guiones y guiones bajos seguidos de letra por letra mayúscula
    result = result.replace(/[\s\-_](.)/g, (match, group1) => group1.toUpperCase());

    // Asegurar que la primera letra es minúscula
    return result.charAt(0).toLowerCase() + result.slice(1);
  }

  /**
   * Convierte un texto en formato PascalCase
   * @param text Texto a convertir
   * @returns Texto en PascalCase
   */
  static toPascalCase(text: string): string {
    // Primero convertir a camelCase
    const camelCase = this.toCamelCase(text);

    // Convertir primera letra a mayúscula
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
  }

  /**
   * Convierte un texto en formato snake_case
   * @param text Texto a convertir
   * @returns Texto en snake_case
   */
  static toSnakeCase(text: string): string {
    if (!text) return '';

    // Primero convertir a minúsculas y eliminar caracteres especiales
    let result = text.toLowerCase().replace(/[^\w\s\-_]/g, '');

    // Reemplazar espacios, guiones y camel case por guión bajo
    result = result.replace(/[\s\-]+/g, '_');
    result = result.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();

    return result;
  }

  /**
   * Convierte un texto en formato kebab-case
   * @param text Texto a convertir
   * @returns Texto en kebab-case
   */
  static toKebabCase(text: string): string {
    if (!text) return '';

    // Primero convertir a minúsculas y eliminar caracteres especiales
    let result = text.toLowerCase().replace(/[^\w\s\-_]/g, '');

    // Reemplazar espacios, guiones bajos y camel case por guión
    result = result.replace(/[\s_]+/g, '-');
    result = result.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

    return result;
  }

  /**
   * Formatea un nombre compuesto insertando espacios entre palabras en CamelCase
   * @param composedName Nombre compuesto (ej: "clienteServicio" o "ClienteServicio")
   * @returns Nombre formateado (ej: "Cliente Servicio")
   */
  static formatComposedName(composedName: string): string {
    if (!composedName) return '';

    // Insertar espacio antes de cada mayúscula, excluyendo la primera letra
    let result = composedName.replace(/([A-Z])/g, ' $1').trim();

    // Asegurar que la primera letra sea mayúscula
    return result.charAt(0).toUpperCase() + result.slice(1);
  }
}
