function newDepthLabel(args){
  return 'New Depth ('+ args.preferredUnit +')';
}

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function getSelectedVolumes(volumes, selectedVolumeIds){
  return volumes.filter(function(volume){
    return selectedVolumeIds.indexOf(volume.id) >= 0;
  });
}

// Define a properties function that returns array of objects representing
// the accepted properties for your application
var properties = function(args){
  var depthOriginal = getSelectedVolumes(args.volumes, args.selectedVolumeIds)[0].cut.depth;
  var step = 0.0001;
  var max = args.material.dimensions.z;
  if (args.preferredUnit === 'mm'){
    depthOriginal = round(depthOriginal * 25.4, 1);
    max = round(max * 25.4, 1);
    step = 0.1;
  }
  else {
    depthOriginal = round(depthOriginal, 4);
  }

  var newDepthInput = {
    type: 'range', 
    id: newDepthLabel(args), 
    value: depthOriginal,
    min: 0,
    max: max,
    step: step
  };

  return [
    newDepthInput
  ];
};

// Define an executor function that builds an array of volumes,
// and passes it to the provided success callback, or invokes the failure
// callback if unable to do so
var executor = function(args, success, failure) {
  var params = args.params;
  var material = args.material;

  var depthNew = parseFloat(params[newDepthLabel(args)]);
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

  args.volumes.forEach(function(volume){
    if (volume.cut.depth == depthOriginal){
      volume.cut.depth = depthNew;
    }
  });

  return success(args.volumes);
};
