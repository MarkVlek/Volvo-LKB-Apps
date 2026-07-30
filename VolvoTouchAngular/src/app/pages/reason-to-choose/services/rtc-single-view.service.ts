import { SpotlightMedia } from "../interfaces/SpotLightMedia.interface";
import { RTCImage } from "../rtc-models/rtc-image.model";
import { RTCItem } from "../rtc-models/rtc-item.model";


export class RTCSingleViewService {

    /**
   * Get the spotlight image or video from an RTCItem.
   * The function returns the media in the following priority:
   * 1. Video if available
   * 2. The first image in the image list if available
   * 3. The image property if available
   * 4. The original image if neither video nor other images are available
   * @param {RTCItem} input - The RTCItem object from which to extract the media
   * @return {SpotlightMedia} - An object containing the URL of the media and a flag indicating if it's a video
   */
    public getSpotLightImg(input: RTCItem): SpotlightMedia {
        // Check if there is a video available, and if so, return the video and set isVideo to true
        if (!!input.video) {
            return { media: input.video, isVideo: true };
        }

        // If there is no video, check if there is an image list
        if (!!input.image_list && input.image_list.length > 0) {
            // If the image list is not empty, return the first image from the list and set isVideo to false
            return { media: input.image_list[0].image, isVideo: false };
        }

        // If the image list is empty, check if there is a single image available
        if (!!input.image) {
            // Return the image and set isVideo to false
            return { media: input.image, isVideo: false };
        }

        // If neither video nor images are available, return the original image and set isVideo to false
        return { media: input.original_image, isVideo: false };
    }


    /**
   * Convert a SpotlightMedia object to an RTCImage object.
   * If the SpotlightMedia object is a video, the function returns null.
   * If the SpotlightMedia object is an image, the function returns an RTCImage object with the image property set.
   * @param {SpotlightMedia} spotlightMedia - The SpotlightMedia object to convert
   * @return {RTCImage | null} - An RTCImage object with the image property set, or null if the SpotlightMedia object is a video
   */
    public convertSpotlightMediaToRTCImage(spotlightMedia: SpotlightMedia): RTCImage | null {
        if (spotlightMedia.isVideo) {
            return null;
        }

        const rtcImage = new RTCImage();
        rtcImage.default_image = true;
        rtcImage.image = spotlightMedia.media;

        return rtcImage;
    }



    /**
  * Extracts text from the given RTCItem object.
  *
  * @param {RTCItem} input - The RTCItem object from which text should be extracted.
  * @return {string} The text from the RTCItem object, or an empty string if no text is available.
  */
    public getInfoText(input: RTCItem): string {
        // Check if the 'text' property exists on the input object.
        // If it does, return its value.
        if (input.hasOwnProperty('text') && typeof input.text === 'string') {
            return input.text;
        }

        // If the 'text' property doesn't exist on the input object, or it's not a string,
        // return an empty string.
        else {
            return "";
        }
    }

    /**
     * Extracts bullet points from the given RTCItem object.
     *
     * @param {RTCItem} input - The RTCItem object from which bullet points should be extracted.
     * @return {string[]} An array containing the bullet points, or an empty array if no bullet points are available.
     */
    public getBulletPoints(input: RTCItem): string[] {
        // Initialize an empty array to hold the bullet points
        const output: string[] = [];

        // Check if the 'bullet_list' property exists on the input object and it contains 'bullets' array.
        // If it does, iterate through the 'bullets' array and push each bullet point to the 'output' array.
        if (input.bullet_list && Array.isArray(input.bullet_list.bullets)) {
            input.bullet_list.bullets.forEach(bl => {
                // Assuming that bl.bullets_list is a string that contains a bullet point.
                if (typeof bl.bullets_list === 'string') {
                    output.push(bl.bullets_list);
                }
            });
        }

        // Return the 'output' array containing the bullet points or an empty array if no bullet points were found.
        return output;
    }

    /**
    * Extracts the media list (including images and video as image) from a given RTCItem object.
    *
    * @param {RTCItem} item - The RTCItem object from which the media list should be extracted.
    * @return {RTCImage[]} An array containing RTCImage objects derived from both images and video, or an empty array if no media items are available.
    */
    public getMediaList(item: RTCItem): RTCImage[] {
        // Initialize an empty array to hold the media items
        let output: RTCImage[] = []

        // Check if the 'image_list' property exists on the item object and it's an array.
        // If it does and it's an array, add each image in the list to the output array.
        if (Array.isArray(item?.image_list)) {
            item.image_list.forEach(element => {
                output.push(element);
            });
        }
        // If there is a 'video' property in the item, create a new RTCImage instance for the video
        // and add it to the output array.
        if (!!item.video) {
            let newImage: RTCImage = {
                default_image: false, // This can be adjusted as per your requirement
                image: item.video, // Assuming 'item.video' is the URL of the video
                image_md5: item.original_image,
            };
            output.push(newImage);
        }

        // Return the array containing the RTCImage objects.
        return output;
    }

    /**
    * Get the spotlight media item based on the selected RTCImage in a list.
    * 
    * @param {RTCImage} selectedImage - The selected RTCImage object from the list.
    * @return {SpotlightMedia} A SpotlightMedia object that contains the selected media and its type (video or image).
    */
    public changeSpotLightMedia(selectedImage: RTCImage): SpotlightMedia {
        // Check if the image path ends with '.mp4' or '.wmv' to determine if it's a video
        if (this.isRealVideo(selectedImage.image)) {
            // If it's a video, return a SpotlightMedia object with the media set to the video URL and isVideo set to true
            return { media: selectedImage.image, isVideo: true };
        }

        // If it's not a video, it's an image. Return a SpotlightMedia object with the media set to the image URL and isVideo set to false
        return { media: selectedImage.image, isVideo: false };
    }



    /**
    * Checks if a given path string is a video based on its file extension.
    *
    * @param {string} path - The string that represents a path to a media file.
    * @return {boolean} A boolean indicating whether the path is for a video file.
    */
    public isRealVideo(path: string): boolean {
        // The method checks if the string 'path' ends with either '.mp4' or '.wmv'.
        // These are common file extensions for video files.
        // If the path ends with either of these extensions, the function returns true, indicating it's a video.
        // If the path does not end with these extensions, it returns false, indicating it's not a video.
        return path.endsWith('.mp4') || path.endsWith('.wmv');
    }

}