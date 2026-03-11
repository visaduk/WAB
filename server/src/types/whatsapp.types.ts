export interface SendMessageResult {
  success: true;
  messageId?: string;
  data: any;
}

export interface SendMessageError {
  success: false;
  error: string;
  errorCode?: number;
  details?: any;
}

export type SendMessageResponse = SendMessageResult | SendMessageError;

export interface MediaUploadResult {
  id: string;
}

export interface TemplateInfo {
  name: string;
  status: string;
  category: string;
  language: string;
  components: Array<{
    type: string;
    text?: string;
    format?: string;
    buttons?: Array<{ type: string; text: string }>;
  }>;
}
