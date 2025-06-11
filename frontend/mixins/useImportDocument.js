import mammoth from "mammoth";
import { data } from "vue2-ace-editor";
import mimeTypes from "~/commons/constants/mime-types";

export default {
  data(){
    return{
      allowedMimeTypes: ["doc", "docx"],
    }
  },
  methods: {
    readFileInputEventAsArrayBuffer(file, callback) {
      var reader = new FileReader();

      reader.onload = function(loadEvent) {
          var arrayBuffer = loadEvent.target.result;
          callback(arrayBuffer);
      };

      reader.readAsArrayBuffer(file);
    },
    importDocument(file) {
      return new Promise((resolve, reject) => {
        const validationFormat = this.validationFormatDocument(file);

        if(validationFormat.status){
          this.readFileInputEventAsArrayBuffer(file, function(arrayBuffer) {
            mammoth.convertToHtml({arrayBuffer: arrayBuffer}).then((result) => {
              resolve({
                status: true,
                message: result.messages,
                data: result.value,
              });
            }, (error) => {
              reject(error);
            });
          });
        }else{
          resolve(validationFormat);
        }
      })
    },

    /**
     * Validation for type or format of file
     * 
     * @param {Object} file - Object file when file selected through the input file
     * @returns {Object} will return message and status of validation.
     */
    validationFormatDocument(file){
      // Get the type of file given by the user
      const mimeTypeGivenFile = file.type;

      // Checking whether the file allowed or not
      const foundAllowedMimeType = this.allowedMimeTypes.find(type => mimeTypes?.[type] === mimeTypeGivenFile);

      // if the file is found, it means the file is allowed, it will return an empty message with the status true
      if(!!foundAllowedMimeType) return { message: "", status: true };

      // If the file not found, it's will return information message with the status false
      else return { 
        message: {
          title: "Format file tidak didukung!",
          description: "Harap unggah file dalam format .doc atau .docx.",
        }, 
        status: false,
      };
    },
  }
}