import { AppDataSource } from '@/config/database.config';
import { Banner } from './banner.entity';

export class BannerService {
  private bannerRepository = AppDataSource.getRepository(Banner);

  async getAll(): Promise<Banner[]> {
    return this.bannerRepository.find({
      order: { display_order: 'ASC' }
    });
  }

  async getById(id: number): Promise<Banner | null> {
    return this.bannerRepository.findOne({
      where: { id }
    });
  }

  async create(data: Partial<Banner>): Promise<Banner> {
    const banner = this.bannerRepository.create(data);
    return this.bannerRepository.save(banner);
  }

  async update(id: number, data: Partial<Banner>): Promise<Banner | null> {
    await this.bannerRepository.update(id, data);
    return this.getById(id);
  }

  async delete(id: number): Promise<void> {
    await this.bannerRepository.delete(id);
  }
}
