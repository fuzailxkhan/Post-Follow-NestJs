import { Injectable ,Logger } from '@nestjs/common';
import * as firebaseAdmin from 'firebase-admin'
import * as path from 'path'

@Injectable()
export class FirebaseService {
    private logger = new Logger(FirebaseService.name)

    constructor(){
        const serviceAccountPath = path.resolve(
            __dirname,
            '../../firebase-service-accountkey.json'
        )
        firebaseAdmin.initializeApp({
            credential:firebaseAdmin.credential.cert(serviceAccountPath),
        })
    }

    async sendPushNotification(
        token: string,
        title: string,
        body: string,
        imageUrl?: string,
        data?: any,
      ) {
        const message = {
          notification: {
            title,
            body,
          },
          webpush: {
            notification: {
              title,
              body,
              icon: imageUrl || ''},
            },
          data: data || {},
          token,
        };
      
        console.log('This is the message being sent ==>', message);
      
        try {
          const response = await firebaseAdmin.messaging().send(message);
          console.log('This is the response from firebaseAdmin.messaging()', response);
          this.logger.log('Successfully sent a Message');
        } catch (error) {
          this.logger.error(`Error Sending Message: ${error.message}`);
        }
      }
      

    async sendPushNotificationsToMultipleDevices(tokens:string[], title:string, body:string, imageUrl?:string, data?:any){
        const message = {
            notification:{
                title,
                body,
                image:imageUrl||''
            },
            data: data||{} , 
            tokens,
        };

        try{
            const response = await firebaseAdmin.messaging().sendEachForMulticast(message);
            this.logger.log('Successfully sent Multicast Message')
        }catch(error){
            this.logger.log(`Error Sending multicast Message ${error}`)
        }
    }

}
