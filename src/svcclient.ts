import { SvcClient, FaceXRequestBuilder, DefaultGuidGenerator } from '@myrotvorets/facex-base';
import { TransportFetch } from '@myrotvorets/facex-transport-node-fetch';
import { ImageProcessorSharp } from '@myrotvorets/facex-image-processor-sharp';

export class FaceXSvcClient extends SvcClient {
    public constructor(url: string, clientID: string) {
        const transport = new TransportFetch();
        const builder = new FaceXRequestBuilder(clientID, new DefaultGuidGenerator(), new ImageProcessorSharp());
        super(url, transport, builder);
    }
}
