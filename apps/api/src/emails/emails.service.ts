import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { DatabaseService } from '../common/database/database.service';

@Injectable()
export class EmailsService {
  private genAI: GoogleGenerativeAI;

  constructor(
    private readonly configService: ConfigService,
    private readonly database: DatabaseService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateEmailContent(leadId: string, context: any = {}) {
    const lead = await this.database.client.lead.findUnique({
      where: { id: leadId },
      include: { company: true },
    });

    if (!lead) {
      throw new Error('Lead not found');
    }

    const prompt = this.buildEmailPrompt(lead, context);
    
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseEmailContent(text);
    } catch (error) {
      throw new Error(`AI generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private buildEmailPrompt(lead: any, context: any) {
    return `
      Generate a professional email for the following lead:
      
      Lead Details:
      - Name: ${lead.firstName} ${lead.lastName}
      - Title: ${lead.title}
      - Company: ${lead.companyName}
      - Email: ${lead.email}
      
      Company Context:
      - Company Name: ${lead.company?.name}
      - Industry: ${lead.company?.industry}
      - Website: ${lead.company?.website}
      
      Email Requirements:
      - Professional and personalized tone
      - Subject line and body content
      - Call-to-action included
      - Length: ${context.length || 'medium'} (short/medium/long)
      - Purpose: ${context.purpose || 'introduction and value proposition'}
      
      Format the response as JSON:
      {
        "subject": "email subject line",
        "content": "email body content"
      }
    `;
  }

  private parseEmailContent(aiResponse: string) {
    try {
      // Try to parse as JSON first
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback: extract subject and content manually
      const subjectMatch = aiResponse.match(/Subject: (.+)/i);
      const subject = subjectMatch ? subjectMatch[1].trim() : 'Personalized Outreach';
      
      // Remove subject line from content if present
      const content = aiResponse.replace(/Subject: .+/i, '').trim();
      
      return { subject, content };
    } catch (error) {
      return {
        subject: 'Personalized Outreach',
        content: aiResponse,
      };
    }
  }

  async createEmailTemplate(companyId: string, templateData: any) {
    return this.database.client.emailTemplate.create({
      data: {
        ...templateData,
        companyId,
        aiGenerated: templateData.aiGenerated || false,
      },
    });
  }

  async getEmailTemplates(companyId: string) {
    return this.database.client.emailTemplate.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async sendEmail(leadId: string, emailData: any) {
    // Create email record
    const email = await this.database.client.email.create({
      data: {
        leadId,
        subject: emailData.subject,
        content: emailData.content,
        status: 'SCHEDULED',
      },
    });

    // TODO: Add to email queue for actual sending
    
    return email;
  }
}