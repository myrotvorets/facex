import { DefaultGuidGenerator, FaceXRequestBuilder, VideoClient } from '@myrotvorets/facex-base';
import { TransportFetch } from '@myrotvorets/facex-transport-fetch-h2';
import { ImageProcessorSharp } from '@myrotvorets/facex-image-processor-sharp';

export class FaceXVideoClient extends VideoClient {
    public constructor(url: string, clientID: string) {
        const transport = new TransportFetch();
        const builder = new FaceXRequestBuilder(clientID, new DefaultGuidGenerator(), new ImageProcessorSharp());
        super(url, transport, builder);
    }
}
