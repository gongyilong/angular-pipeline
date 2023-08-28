import { Component, OnInit } from '@angular/core';
declare var Cesium;

@Component({
  selector: 'app-cesium-terrain',
  templateUrl: './cesium-terrain.component.html',
  styleUrls: ['./cesium-terrain.component.css']
})
export class CesiumTerrainComponent implements OnInit {

  /********** 全局变量 **********/
  viewer: any;
  selectedText = 'None';
  selectValue = 'none';
  options = [
    {
      text: "None",
      value: "none"
    },
    {
      text: "高程",
      value: "elevation"
    },
    {
      text: "坡度",
      value: "slope"
    },
    {
      text: "坡向",
      value: "aspect"
    }
  ]
  //地形相关
  minHeight = -414.0; // approximate dead sea elevation
  maxHeight = 8777.0; // approximate everest elevation
  contourColor = Cesium.Color.RED.clone();
  contourUniforms: any = {};
  shadingUniforms: any = {};

  elevationRamp = [0.0, 0.045, 0.1, 0.15, 0.37, 0.54, 1.0];
  slopeRamp = [0.0, 0.29, 0.5, Math.sqrt(2) / 2, 0.87, 0.91, 1.0];
  aspectRamp = [0.0, 0.2, 0.4, 0.6, 0.8, 0.9, 1.0];

  checked = false;

  viewModel = {
    enableContour: false,
    contourSpacing: 50.0,
    contourWidth: 2.0,
    selectedShading: "none",
    changeColor: function () {
      this.contourUniforms.color = Cesium.Color.fromRandom(
        { alpha: 1.0 },
        this.contourColor
      );
    },
  };
  material:any;

  constructor() { }

  //初始化
  ngOnInit(): void {
    this.viewer = new Cesium.Viewer('cesiumContainer', {
      navigationHelpButton: false,
      timeline: false,
      animation: false,
      baseLayerPicker: false,
      terrainProvider: new Cesium.createWorldTerrain({
        requestVertexNormals: true, //Needed to visualize slope
      }),
    });
    this.viewer.scene.globe.depthTestAgainstTerrain = true;
    this.viewer.cesiumWidget.creditContainer.style.display = "none";
    this.viewer.scene.globe.enableLighting = true;
  }

  getElevationContourMaterial() {
    return new Cesium.Material({
      fabric: {
        type: "ElevationColorContour",
        materials: {
          contourMaterial: {
            type: "ElevationContour",
          },
          elevationRampMaterial: {
            type: "ElevationRamp",
          },
        },
        components: {
          diffuse:
            "contourMaterial.alpha == 0.0 ? elevationRampMaterial.diffuse : contourMaterial.diffuse",
          alpha:
            "max(contourMaterial.alpha, elevationRampMaterial.alpha)",
        },
      },
      translucent: true,
    });
  }

  getSlopeContourMaterial() {
    // Creates a composite material with both slope shading and contour lines
    return new Cesium.Material({
      fabric: {
        type: "SlopeColorContour",
        materials: {
          contourMaterial: {
            type: "ElevationContour",
          },
          slopeRampMaterial: {
            type: "SlopeRamp",
          },
        },
        components: {
          diffuse:
            "contourMaterial.alpha == 0.0 ? slopeRampMaterial.diffuse : contourMaterial.diffuse",
          alpha: "max(contourMaterial.alpha, slopeRampMaterial.alpha)",
        },
      },
      translucent: false,
    });
  }

  getAspectContourMaterial() {
    // Creates a composite material with both aspect shading and contour lines
    return new Cesium.Material({
      fabric: {
        type: "AspectColorContour",
        materials: {
          contourMaterial: {
            type: "ElevationContour",
          },
          aspectRampMaterial: {
            type: "AspectRamp",
          },
        },
        components: {
          diffuse:
            "contourMaterial.alpha == 0.0 ? aspectRampMaterial.diffuse : contourMaterial.diffuse",
          alpha: "max(contourMaterial.alpha, aspectRampMaterial.alpha)",
        },
      },
      translucent: false,
    });
  }

  getColorRamp(selectedShading) {
    var ramp = document.createElement("canvas");
    ramp.width = 100;
    ramp.height = 1;
    var ctx = ramp.getContext("2d");

    var values;
    if (selectedShading === "elevation") {
      values = this.elevationRamp;
    } else if (selectedShading === "slope") {
      values = this.slopeRamp;
    } else if (selectedShading === "aspect") {
      values = this.aspectRamp;
    }

    var grd = ctx.createLinearGradient(0, 0, 100, 0);
    grd.addColorStop(values[0], "#000000"); //black
    grd.addColorStop(values[1], "#2747E0"); //blue
    grd.addColorStop(values[2], "#D33B7D"); //pink
    grd.addColorStop(values[3], "#D33038"); //red
    grd.addColorStop(values[4], "#FF9742"); //orange
    grd.addColorStop(values[5], "#ffd700"); //yellow
    grd.addColorStop(values[6], "#ffffff"); //white

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 100, 1);

    return ramp;
  }

  updateMaterial() {
    var hasContour = this.viewModel.enableContour;
    var selectedShading = this.viewModel.selectedShading;
    var globe = this.viewer.scene.globe;
    // var material;
    if (hasContour) {
      if (selectedShading === "elevation") {
        this.material = this.getElevationContourMaterial();
        this.shadingUniforms = this.material.materials.elevationRampMaterial.uniforms;
        this.shadingUniforms.minimumHeight = this.minHeight;
        this.shadingUniforms.maximumHeight = this.maxHeight;
        this.contourUniforms = this.material.materials.contourMaterial.uniforms;
      } else {
        this.material = Cesium.Material.fromType("ElevationContour");
        this.contourUniforms = this.material.uniforms;
      }
      this.contourUniforms.width = this.viewModel.contourWidth;
      this.contourUniforms.spacing = this.viewModel.contourSpacing;
      this.contourUniforms.color = this.contourColor;
    } else if (selectedShading === "elevation") {
      this.material = Cesium.Material.fromType("ElevationRamp");
      this.shadingUniforms = this.material.uniforms;
      this.shadingUniforms.minimumHeight = this.minHeight;
      this.shadingUniforms.maximumHeight = this.maxHeight;
    }
    if (selectedShading !== "none") {
      this.shadingUniforms.image = this.getColorRamp(selectedShading);
    }
    globe.material = this.material;
  }

  //加载模型
  loadModel(v: any) {
    let target = this.options.find((value, index, arr) => {
      return value.text == v
    })
    this.selectValue = target.value;
    this.terrainRender(target.value);
  }

  terrainRender(type): void {
    this.material = null;
    if(this.checked){
      this.enableContourLines(this.checked)
    }else{
    switch (type) {
      case "elevation":
        this.material = Cesium.Material.fromType("ElevationRamp");
        this.shadingUniforms = this.material.uniforms;
        this.shadingUniforms.minimumHeight = this.minHeight;
        this.shadingUniforms.maximumHeight = this.maxHeight;
        break;
      case "slope":
        this.material = Cesium.Material.fromType("SlopeRamp");
        this.shadingUniforms = this.material.uniforms;
        break;
      case "aspect":
        this.material = Cesium.Material.fromType("AspectRamp");
        this.shadingUniforms = this.material.uniforms;
        break;
    }
    this.viewer.scene.globe.material = this.material;
    }

    if (type !== "none") {
      this.shadingUniforms.image = this.getColorRamp(type);
    }
  }


  enableContourLines(e: any){
    this.material = null;
    if(e){
      //打开等高线
      if (this.selectValue === "elevation") {
        this.material = this.getElevationContourMaterial();
        this.shadingUniforms = this.material.materials.elevationRampMaterial.uniforms;
        this.shadingUniforms.minimumHeight = this.minHeight;
        this.shadingUniforms.maximumHeight = this.maxHeight;
        this.contourUniforms = this.material.materials.contourMaterial.uniforms;
      } else if (this.selectValue === "slope") {
        this.material = this.getSlopeContourMaterial();
        this.shadingUniforms = this.material.materials.slopeRampMaterial.uniforms;
        this.contourUniforms = this.material.materials.contourMaterial.uniforms;
      } else if (this.selectValue === "aspect") {
        this.material = this.getAspectContourMaterial();
        this.shadingUniforms = this.material.materials.aspectRampMaterial.uniforms;
        this.contourUniforms = this.material.materials.contourMaterial.uniforms;
      } else {
        this.material = Cesium.Material.fromType("ElevationContour");
        this.contourUniforms = this.material.uniforms;
      }
      this.contourUniforms.width = this.viewModel.contourWidth;
      this.contourUniforms.spacing = this.viewModel.contourSpacing;
      this.contourUniforms.color = this.contourColor;
      this.viewer.scene.globe.material = this.material;
      if (this.selectValue !== "none") {
        this.shadingUniforms.image = this.getColorRamp(this.selectValue);
      }
    }else{
      this.terrainRender(this.selectValue);
    }
  }
}
