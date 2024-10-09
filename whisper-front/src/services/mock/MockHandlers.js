import { http, HttpResponse } from 'msw'
import { chatData } from './ChatData';

export const httpClient = [
    http.get('/api/chats', () => {
        return new HttpResponse(
          JSON.stringify(chatData),
          {
            status: 200, // or any other appropriate status code
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      }),
]; // Define your http requets