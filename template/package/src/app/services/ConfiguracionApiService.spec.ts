import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConfiguracionApiService } from './ConfiguracionApiService';

describe('ConfiguracionApiService', () => {
  let service: ConfiguracionApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConfiguracionApiService]
    });
    service = TestBed.inject(ConfiguracionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call findAll', () => {
    // TODO: Implement test for findAll
  });

  it('should call findById', () => {
    // TODO: Implement test for findById
  });

  it('should call save', () => {
    // TODO: Implement test for save
  });

  it('should call update', () => {
    // TODO: Implement test for update
  });

  it('should call deleteById', () => {
    // TODO: Implement test for deleteById
  });

  it('should call findActivas', () => {
    // TODO: Implement test for findActivas
  });

  it('should call findByEntidadAsociada', () => {
    // TODO: Implement test for findByEntidadAsociada
  });

  it('should call findConfiguracionesConAutenticacion', () => {
    // TODO: Implement test for findConfiguracionesConAutenticacion
  });

  it('should call findByNombre', () => {
    // TODO: Implement test for findByNombre
  });

  it('should call existsByUrlBase', () => {
    // TODO: Implement test for existsByUrlBase
  });

  it('should call countActivas', () => {
    // TODO: Implement test for countActivas
  });

});
