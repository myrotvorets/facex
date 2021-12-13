import { Client, DefaultGuidGenerator, FaceXRequestBuilder } from '@myrotvorets/facex-base';
import { TransportFetch } from '@myrotvorets/facex-transport-fetch-h2';
import { ImageProcessorSharp } from '@myrotvorets/facex-image-processor-sharp';

export class FaceXClient extends Client {
    public constructor(url: string, clientID: string) {
        const transport = new TransportFetch();
        const builder = new FaceXRequestBuilder(clientID, new DefaultGuidGenerator(), new ImageProcessorSharp());
        super(url, transport, builder);
    }
}
