import { Global, Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';


@Global()
@Module({
  providers: [FirebaseService],
  exports: [FirebaseService], // ✅ Exporting so other modules can use it
})
export class FirebaseModule {}
