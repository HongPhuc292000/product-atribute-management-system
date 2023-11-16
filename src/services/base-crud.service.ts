import {
  HttpStatus,
  NotFoundException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import {
  DataSource,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { IBaseService } from 'src/types/BaseService';
import { CustomBaseEntity } from 'src/utils/base.entity';
import { ListResponseData, ResponseData } from 'src/types';

@Injectable()
export abstract class BaseService<Entity extends CustomBaseEntity>
  implements IBaseService<Entity>
{
  constructor(private readonly genericRepository: Repository<Entity>) {}

  async checkUniqueFieldDataIsUsed(
    where: FindOptionsWhere<Entity>,
    targetName: string,
  ) {
    const entity = await this.genericRepository.findOne({ where });
    if (entity) {
      throw new BadRequestException({
        message: `${targetName} is used`,
        error: 'Bad Request',
      });
    }
  }

  async findExistedData(where: FindOptionsWhere<Entity>, targetName: string) {
    const entity = await this.genericRepository.findOne({ where });
    if (entity) {
      return entity;
    } else {
      throw new BadRequestException({
        message: `not found ${targetName}`,
        error: 'Bad Request',
      });
    }
  }

  async saveNewData(entity: Entity) {
    const createdEntity = await this.genericRepository.save(entity);
    return new ResponseData(createdEntity.id, HttpStatus.CREATED);
  }

  async handlePageSize(
    selectQueryBuilder: SelectQueryBuilder<Entity>,
    all?: 1,
    page?: number,
    size?: number,
  ): Promise<ListResponseData<Entity>> {
    const queryPage = page;
    const querySize = size;
    selectQueryBuilder.skip(all ? 0 : (page - 1) * size);
    if (!all) {
      selectQueryBuilder.take(size);
    }
    const records = await selectQueryBuilder.getMany();
    const totalRecord = await this.genericRepository.count();
    if (all) {
      return new ListResponseData(records, totalRecord);
    }
    return new ListResponseData(records, totalRecord, queryPage, querySize);
  }

  async findById(id: any, entityName: string): Promise<ResponseData<Entity>> {
    const entity = await this.genericRepository.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException({
        message: `not found this ${entityName}`,
        error: 'Not Found',
      });
    }
    return new ResponseData(entity);
  }

  async updateData(entity: Entity, newData: Partial<Entity>) {
    const updatedEntity = await this.genericRepository.save({
      ...entity,
      ...newData,
    });

    return new ResponseData(updatedEntity.id);
  }

  async removeData(entity: Entity) {
    await this.genericRepository.save(entity);
    await this.genericRepository.softRemove(entity);
    return new ResponseData('Deleted');
  }
}
