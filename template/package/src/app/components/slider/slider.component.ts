/**
 * Componente: SliderComponent
 * Descripcion: Slider de imagenes reutilizable usando Swiper.
 *
 * Inputs:
 * - images: Lista de imagenes con src y alt. Ej: [{ src: 'url', alt: 'texto' }]
 * - effect: Efecto de transicion entre slides. Puede ser: 'slide', 'fade', 'cube', 'coverflow', 'flip', 'creative', 'cards'
 * - autoplayDelay: Tiempo en ms para cambiar de imagen automaticamente. Por defecto 3000 (3 segundos)
 * - showNavigation: Muestra flechas de siguiente/anterior. true o false. Por defecto true
 * - showPagination: Muestra los puntos de navegacion (bullets). true o false. Por defecto true
 * - loop: Hace que el slider vuelva al inicio al llegar al final. true o false. Por defecto true
 *
 * Ejemplo de uso:
 * <app-slider
 *   [images]="misImagenes"
 *   effect="fade"
 *   [autoplayDelay]="5000"
 *   [showNavigation]="true"
 *   [showPagination]="true"
 *   [loop]="true"
 * ></app-slider>
 */


import { Component, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { Navigation, Pagination, Autoplay, EffectFade, EffectCube, EffectCoverflow, EffectFlip, EffectCreative, EffectCards } from 'swiper/modules';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";

type SwiperEffect = 'slide' | 'fade' | 'cube' | 'coverflow' | 'flip' | 'creative' | 'cards';

@Component({
  selector: 'app-slider',
  standalone: true,
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  imports: [
    NgIf,
    NgForOf
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Añade esto para soportar web components
})
export class SliderComponent implements AfterViewInit {
  @ViewChild('swiperContainer', { static: true }) swiperContainer!: ElementRef;

  @Input() images: { src: string; alt: string }[] = [];
  @Input() effect: SwiperEffect = 'slide';
  @Input() autoplayDelay: number = 3000;
  @Input() showNavigation: boolean = true;
  @Input() showPagination: boolean = true;
  @Input() loop: boolean = true;

  ngAfterViewInit() {
    register(); // Registra los web components de Swiper

    const swiperEl = this.swiperContainer.nativeElement;

    // Configuración dinámica de módulos
    const effectModules = {
      'fade': EffectFade,
      'cube': EffectCube,
      'coverflow': EffectCoverflow,
      'flip': EffectFlip,
      'creative': EffectCreative,
      'cards': EffectCards
    };

    const modules = [
      Navigation,
      Pagination,
      Autoplay,
      effectModules[this.effect as keyof typeof effectModules]
    ].filter(Boolean);

    // Configuración como propiedades
    Object.assign(swiperEl, {
      modules,
      effect: this.effect,
      loop: this.loop,
      autoplay: {
        delay: this.autoplayDelay,
        disableOnInteraction: false
      },
      pagination: this.showPagination ? {
        clickable: true,
        dynamicBullets: true
      } : false,
      navigation: this.showNavigation,
      keyboard: {
        enabled: true
      },
      ...this.getEffectParams()
    });

    // Inicialización diferida para asegurar renderizado
    setTimeout(() => swiperEl.initialize(), 10);
  }

  private getEffectParams() {
    switch(this.effect) {
      case 'cube':
        return {
          cubeEffect: {
            shadow: true,
            slideShadows: true,
            shadowOffset: 20,
            shadowScale: 0.94
          }
        };
      case 'coverflow':
        return {
          coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true
          }
        };
      case 'flip':
        return {
          flipEffect: {
            slideShadows: true,
            limitRotation: true
          }
        };
      case 'creative':
        return {
          creativeEffect: {
            prev: {
              translate: [0, 0, -400],
            },
            next: {
              translate: ['100%', 0, 0],
            }
          }
        };
      case 'cards':
        return {
          cardsEffect: {
            perSlideOffset: 8,
            perSlideRotate: 2
          }
        };
      default:
        return {};
    }
  }
}
