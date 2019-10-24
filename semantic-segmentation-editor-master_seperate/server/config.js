import {Meteor} from "meteor/meteor";
import {join} from "path";
import {mkdirSync, existsSync} from "fs";
import os from "os";
import download from "download";

const configurationFile = {};
const defaultClasses = [{
    "name": "58 Classes","objects": [
        {"label":" Black","color":"#000000"},
        {"label":" Altered Foveal Contour","color":"#806440"},
        {"label":" Atrophic pigmented scars","color":"#3366ff"},
        {"label":" Choroidal folds","color":"#ff6600"},
        {"label":" Choroidal neo vascular membrane","color":"#66ffd1"},
        {"label":" Choroidal thickening","color":"#daf7a6"},
        {"label":" Cystoid edema involving the fovea","color":"#9c2542"},
        {"label":" Cystoid macular edema","color":"#4682b4"},
        {"label":" Cystoid macular degeneration","color":"#a84d4d"},
        {"label":" Cuticular pseudo_Drusen","color":"#f2ff00"},
        {"label":" Dissociated optic nerve fiber layer appearance","color":"#cc0000"},
        {"label":" Dome shaped macula","color":"#008080"},
        {"label":" Druse_Soft drusen_Confluent drusen","color":"#72934b"},
        {"label":" Drusen of the macula DRY AMD","color":"#730de8"},
        {"label":" Cuticular drusen_Vitelliform detachment","color":"#993d00"},
        {"label":" Reticular pseudodrusen","color":"#e936a7"},
        {"label":" Epi macular membrane Cellophane maculopathy","color":"#405680"},
        {"label":" Epi Retinal Membrane","color":"#ff5470"},
        {"label":" Flap Traction","color":"#bf8130"},
        {"label":" Foveal detachment","color":"#ff00ff"},
        {"label":" Foveal Cystoid spaces","color":"#7df9ff"},
        {"label":" Full-thickness idiopathic macular hole","color":"#c3f7c7"},
        {"label":" Ganglion Cell Loss","color":"#008000"},
        {"label":" Hard Exudates","color":"#6c541e"},
        {"label":" Hemorrhagic pigment epithelial detachment","color":"#76ee00"},
        {"label":" Hyper reflective Intra retinal foci","color":"#1b4d3e"},
        {"label":" ILM detachment","color":"#808000"},
        {"label":" Intra retinal Cystic changes(spaces without intraretinal leakage)","color":"#6ccebc"},
        {"label":" Intra retinal diffuse edema","color":"#d5ae3f"},
        {"label":" Lacquer cracks","color":"#836fff"},
        {"label":" Lamellar macular hole","color":"#992900"},
        {"label":" Lamellar macular pseudo cyst","color":"#ff8f66"},
        {"label":" Lamellar macular pseudo hole","color":"#ff4400"},
        {"label":" Loss of  Foveal contour","color":"#bf6060"},
        {"label":" Macular microholes","color":"#872657"},
        {"label":" Microaneurysms","color":"#8b668b"},
        {"label":" Macroaneurysms","color":"#b3ee3a"},
        {"label":" Myopic tractional retinal detachment","color":"#ffbf00"},
        {"label":" Myopic Vitreo retinal traction","color":"#f29bb0"},
        {"label":" Nerve fiber thinning","color":"#e6cfcf"},
        {"label":" Optic disc Cupping","color":"#9966cc"},
        {"label":" Outer retinal tubulations","color":"#cc99cc"},
        {"label":" Pearl Necklace sign(Chronic macular edema)","color":"#fae7b5"},
        {"label":" Posterior Vitreous Detachment Face Partial","color":"#86608e"},
        {"label":" Posterior Vitreous Detachment Face Total","color":"#b4ffff"},
        {"label":" Preretinal haemorrhages","color":"#dc143c"},
        {"label":" Pseudo-operculum","color":"#483d8b"},
        {"label":" Retinal Angiomatous Proliferation(RAP lesion )","color":"#082ac4"},
        {"label":" Retinal atrophy Geographic Atrophy Advanced","color":"#43a047"},
        {"label":" Retinal Pigment Epithelium Detachment","color":"#ffc766"},
        {"label":" Retinoschisis","color":"#e9967a"},
        {"label":" Serous RPE Detachment(PED)","color":"#00009c"},
        {"label":" Shadowing","color":"#fbceb1"},
        {"label":" Smoke-stack pattern(Acute central serous chorioretinopathy)","color":"#f54d70"},
        {"label":" Stretched Muller Fibers(Pillars)","color":"#804840"},
        {"label":" Sub retinal fluid(SRF)","color":"#72a372"},
        {"label":" Vitreo Macular Traction","color":"#4a684c"},
        {"label":" Yellowish-white spots(Punctate inner choroidopathy)","color":"#cccc00"},
    ]
}];
const init = ()=> {
    try {
        const config = Meteor.settings;

        if (config.configuration && config.configuration["images-folder"] != "") {
            configurationFile.imagesFolder = config.configuration["images-folder"].replace(/\/$/, "");
        }else{
            configurationFile.imagesFolder = join(os.homedir(), "sse-images");
        }

        if (!existsSync(configurationFile.imagesFolder)){
            mkdirSync(configurationFile.imagesFolder);
            download("https://raw.githubusercontent.com/Hitachi-Automotive-And-Industry-Lab/semantic-segmentation-editor/master/private/samples/bitmap_labeling.png", configurationFile.imagesFolder);
            download("https://raw.githubusercontent.com/Hitachi-Automotive-And-Industry-Lab/semantic-segmentation-editor/master/private/samples/pointcloud_labeling.pcd", configurationFile.imagesFolder);
        }

        if (config.configuration && config.configuration["internal-folder"] != "") {
            configurationFile.pointcloudsFolder = config.configuration["internal-folder"].replace(/\/$/, "");
        }else{

            configurationFile.pointcloudsFolder = join(os.homedir(), "sse-internal");
        }

        configurationFile.setsOfClassesMap = new Map();
        configurationFile.setsOfClasses = config["sets-of-classes"];
        if (!configurationFile.setsOfClasses){
            configurationFile.setsOfClasses = defaultClasses;
        }
        configurationFile.setsOfClasses.forEach(o => configurationFile.setsOfClassesMap.set(o.name, o));
        console.log("Semantic Segmentation Editor");
        console.log("Images (JPG, PNG, PCD) served from", configurationFile.imagesFolder);
        console.log("PCD binary segmentation data stored in", configurationFile.pointcloudsFolder);
        console.log("Number of available sets of object classes:", configurationFile.setsOfClasses.length);
        return configurationFile;
    }catch(e){
        console.error("Error while parsing settings.json:", e);
    }
};
export default init();
