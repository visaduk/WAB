import { whatsappService } from './whatsapp.service';
import { logger } from '../utils/logger';

class MediaService {
  async upload(fileBuffer: Buffer, mimeType: string, filename: string) {
    try {
      const result = await whatsappService.uploadMedia(fileBuffer, mimeType, filename);
      return { success: true, mediaId: result.id };
    } catch (error: any) {
      logger.error('Media upload failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async download(mediaId: string): Promise<{ buffer: Buffer; url: string } | null> {
    try {
      const url = await whatsappService.getMediaUrl(mediaId);
      const buffer = await whatsappService.downloadMedia(url);
      return { buffer, url };
    } catch (error: any) {
      logger.error('Media download failed:', error.message);
      return null;
    }
  }
}

export const mediaService = new MediaService();
