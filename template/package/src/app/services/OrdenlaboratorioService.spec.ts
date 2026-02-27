import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrdenlaboratorioService } from './OrdenlaboratorioService';

describe('OrdenlaboratorioService', () => {
  let service: OrdenlaboratorioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrdenlaboratorioService]
    });
    service = TestBed.inject(OrdenlaboratorioService);
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

});
