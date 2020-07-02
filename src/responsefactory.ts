import * as Response from './response';

export function responseFactory(r: Response.RawResponse): Response.Response {
    if (typeof r.ans_type !== 'number') {
        r.ans_type = parseInt(r.ans_type, 10);
    }

    switch (r.ans_type) {
        case 8:
            return new Response.BaseStatus(r);

        case 16:
            return new Response.StartCompareAck(r);
        case 17:
            return new Response.UploadCompareAck(r);
        case 18:
            return new Response.CompareCompleted(r);

        case 33:
            return new Response.SearchUploadAck(r);
        case 34:
            return new Response.SearchUploadError(r);

        case 65:
            return new Response.SearchInProgress(r);
        case 66:
            return new Response.SearchFailed(r);
        case 67:
            return new Response.SearchCompleted(r);

        case 80:
            return new Response.CapturedFaces(r);
        case 85: // getCapturedFaces() while search is still in progress
            return new Response.SearchInProgress(r);
        case 87: // Wrong GUID passed to getCapturedFaces()
            return new Response.CapturedFacesError(r);

        case 128:
            return new Response.RecognitionStats(r);
        case 228: // getRecognitionStats() while search is still in progress or if GUID is bad
            return new Response.RecognitionStatsNotAvailable(r);

        case 129:
            return new Response.MatchedFaces(r);
        case 229: // getMatchedFaces() while search is still in progress or if GUID is bad
            return new Response.MatchedFacesError(r);

        case 192:
            return new Response.QuerySectorAck(r);
        case 193:
            return new Response.QuerySectorStatus(r);
        case 194:
            return new Response.QuerySectorResult(r);

        case 200:
            return new Response.QuerySectorStatsAck(r);
        case 201:
            return new Response.QuerySectorStatsResult(r);

        case 204:
            return new Response.PrepareAddAck(r);
        case 205:
            return new Response.PrepareAddStatus(r);
        case 206:
            return new Response.PreparedFaces(r);
        case 207:
            return new Response.AddPreparedFacesAck(r);

        case 208:
            return new Response.DeleteAck(r);
        case 209:
            return new Response.DeleteStatus(r);

        default:
            return new Response.Response(r);
    }
}
