// Define a properties array that returns array of objects representing
// the accepted properties for your application
var properties = [
  //{type: 'text', id: "Original Depth"},
  {type: 'text', id: 'New Depth'}
];

var getSelectedVolumes = function(volumes, selectedVolumeIds){
  return volumes.filter(function(volume){
    return selectedVolumeIds.indexOf(volume.id) >= 0;
  });
};

// Define an executor function that builds an array of volumes,
// and passes it to the provided success callback, or invokes the failure
// callback if unable to do so
var executor = function(args, success, failure) {
  var params = args.params;
  var material = args.material;
  var volumes = [];
  
  console.log(args.volumes);
  
  var depthNew = parseFloat(params['New Depth']);
  if (isNaN(depthNew)){ return failure('Please provide a value for "New Depth"'); }
  
  //If user has mm selected covert to in
  if (args.preferredUnit === 'mm'){
    depthNew /= 25.4; 
  }
  
  if (depthNew < 0){
    depthNew = 0;
  }
  
  if (depthNew > material.dimensions.z){
    depthNew = material.dimensions.z;
  }
  
  var depthOriginal = getSelectedVolumes(args.volumes, args.selectedVolumeIds)[0].cut.depth;
  
  
  //find only with specified depth
  var selectedVolumes = args.volumes.filter(function(item){ 
    return item.cut.depth == depthOriginal;
  });

  selectedVolumes.forEach(function(volume){
    //NOTE: have to delete the old one and add new otherwise you 
    //      get an error about ID's not being unique
    volumes.push({ id: volume.id });// add id with no shape to delete the existing one
    delete volume.id;//remove id so it imports as new shape
    volume.cut.depth = depthNew;
    volumes.push(volume);
  });
  
  /*
  console.log({
    originalVolumes: args.volumes,
    depthNew,
    volumes
  });
  */
  
  return success(volumes);
};
