import { Injectable } from '@angular/core';
import { Material } from 'cesium';
declare var Cesium;

@Injectable()
export class CesiumService {

	constructor() { }
	/********** 基础部分 **********/
	/**
	 * 创建Cesium.Viewer容器
	 * @param el 页面Id
	 * @returns 
	 */
	createViewer(el): Promise<any> {
		return new Promise((resolve, reject) => {
			const viewer = new Cesium.Viewer(el, {
				navigationHelpButton: false,
				timeline: false,
				animation: false,
				baseLayerPicker: false,
				geocoder:false,  //搜索框
            	homeButton:false,  //home按钮
            	sceneModePicker:false, //模式切换按钮
				// imageryLayers: new Cesium.ArcGisMapServerImageryProvider({
				// 	url: 'http://10.10.0.30:6080/arcgis/rest/services/BaseMap/ZhuHai_ZhongS_Image_LOD/MapServer',
				// 	baseLayerPicker: false
				// })
				// terrainProvider: new Cesium.createWorldTerrain({
				// 	requestVertexNormals: true, 
				// }),
			});
			viewer.cesiumWidget.creditContainer.style.display = "none";
			// viewer.scene.globe.enableLighting = true;
			viewer.scene.globe.depthTestAgainstTerrain = true;
			resolve(viewer);
		})
	}

	/**
	 * 创建3DTiles
	 * @param url 
	 * @returns 
	 */
	create3DTiles(url): Promise<any> {
		return new Promise((resolve, reject) => {
			const tileset = new Cesium.Cesium3DTileset({
				url: url,
				colorBlendMode: Cesium.Cesium3DTileColorBlendMode.HIGHLIGHT
			});
			resolve(tileset);
		})
	}

	/**
	 * 创建ArcGIS图层
	 * @param url 
	 * @returns 
	 */
	createArcGISLayer(url, rectangle): Promise<any> {
		return new Promise((resolve, reject) => {
			const layer = new Cesium.ImageryLayer(
				new Cesium.ArcGisMapServerImageryProvider({
					url: url,
					rectangle: rectangle
					// rectangle: new Cesium.Rectangle.fromDegrees( 73.55770111 , 18.15930557 , 134.77392578 , 53.56085968 )
				}))
			resolve(layer);
		})
	}

	/********** 地形分析专题 **********/
	////等高线、坡度、坡向
	/**
	 * 高度材质
	 * @returns 
	 */
	getElevationContourMaterial() {
		const eleMaterial = new Cesium.Material({
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
		})
		return eleMaterial;
	}

	/**
	 * 坡度材质
	 * @returns 
	 */
	getSlopeContourMaterial(): Promise<any> {
		return new Promise((resolve, reject) => {
			const slopeMaterial = new Cesium.Material({
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
			resolve(slopeMaterial);
		})
	}

	/**
	 * 坡向材质
	 * @returns 
	 */
	getAspectContourMaterial(): Promise<any> {
		return new Promise((resolve, reject) => {
			const aspectMaterial = new Cesium.Material({
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
			resolve(aspectMaterial);
		})
	}

	//色带
	getColorRamp(canvasEl: any, selectedShading: any, opcity: any, eleRamp: any) {
		//定义
		const ramp = canvasEl;
		ramp.width = 100;
		ramp.height = 1;
		// const elevationRamp = [0.0, 0.045, 0.1, 0.15, 0.37, 0.54, 1.0];
		const slopeRamp = [0.0, 0.29, 0.5, Math.sqrt(2) / 2, 0.87, 0.91, 1.0];
		const aspectRamp = [0.0, 0.2, 0.4, 0.6, 0.8, 0.9, 1.0];
		const ctx = ramp.getContext("2d");
		let values: any;
		const grd = ctx.createLinearGradient(0, 0, 100, 0);
		if (selectedShading === "elevation") {
			// values = elevationRamp;
			eleRamp.forEach(element => {
				let colorArr = element.split(" ");
				console.log(colorArr[1]);
				grd.addColorStop(parseFloat(colorArr[1]), colorArr[0]);
			});
		} else if (selectedShading === "slope") {
			values = slopeRamp;
		} else if (selectedShading === "aspect") {
			values = aspectRamp;
		};

		// grd.addColorStop(values[0], "#000000"); //black
		// grd.addColorStop(values[1], "#2747E0"); //blue
		// grd.addColorStop(values[2], "#D33B7D"); //pink
		// grd.addColorStop(values[3], "#D33038"); //red
		// grd.addColorStop(values[4], "#FF9742"); //orange
		// grd.addColorStop(values[5], "#ffd700"); //yellow
		// grd.addColorStop(values[6], "#ffffff"); //white

		ctx.fillStyle = grd;
		ctx.globalAlpha = opcity;
		ctx.fillRect(0, 0, 100, 1);
		// ctx.fillRect(0, 0, 1, 100);
		return ramp;
	}

	/********** 绘制点、线、面 **********/
	////创建点要素
	createPoint(worldPosition, viewer) {
		const point = viewer.entities.add({
			position: worldPosition,
			point: {
				color: Cesium.Color.WHITE,
				pixelSize: 5,
				heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
			}
		});
		return point;
	}

	//绘制
	drawShape(positionData, drawingMode, viewer, m) {
		let shape;
		if (drawingMode === "line") {
			shape = viewer.entities.add({
				polyline: {
					positions: positionData,
					clampToGround: true,
					width: 3,
				},
			});
		} else if (drawingMode === "polygon") {
			shape = viewer.entities.add({
				polygon: {
					hierarchy: positionData,
					material: m,
					// material: new Cesium.ImageMaterialProperty({
					// 	image: m.image,
					// }),
				},
			});
		}
		return shape;
	}

	//开始绘制
	startDraw(handler, viewer, drawingMode, m) {

		let activeShapePoints = [];
		let activeShape;
		let floatingPoint;

		//是否支持选点
		if (!viewer.scene.pickPositionSupported) {
			console.log("This browser does not support pickPosition.");
		}

		//鼠标左键开始绘制
		handler.setInputAction((event) => {
			//屏幕选取点
			let earthPosition = viewer.scene.pickPosition(event.position);
			//`earthPosition` will be undefined if our mouse is not over the globe.
			if (Cesium.defined(earthPosition)) {
				if (activeShapePoints.length === 0) {
					floatingPoint = this.createPoint(earthPosition, viewer);
					activeShapePoints.push(earthPosition);
					var dynamicPositions = new Cesium.CallbackProperty(() => {
						if (drawingMode === "polygon") {
							return new Cesium.PolygonHierarchy(activeShapePoints);
						}
						return activeShapePoints;
					}, false);
					activeShape = this.drawShape(dynamicPositions, drawingMode, viewer, m);
				}
				activeShapePoints.push(earthPosition);
				this.createPoint(earthPosition, viewer);
			}

		}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

		//鼠标滑动事件
		handler.setInputAction((event) => {
			if (Cesium.defined(floatingPoint)) {
				let newPosition = viewer.scene.pickPosition(event.endPosition);
				if (Cesium.defined(newPosition)) {
					floatingPoint.position.setValue(newPosition);
					activeShapePoints.pop();
					activeShapePoints.push(newPosition);
				}
			}
		}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

		//鼠标右键结束绘制
		handler.setInputAction((event) => {
			activeShapePoints.pop();
			this.drawShape(activeShapePoints, drawingMode, viewer, m);
			viewer.entities.remove(floatingPoint);
			viewer.entities.remove(activeShape);
			floatingPoint = undefined;
			activeShape = undefined;
			activeShapePoints = [];
			console.log(viewer.entities);
		}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

	};

	//结束绘制
	stopCreate() {

	}

	/********** 空间分析专题 **********/
	//通视分析
	//思路：
	//1.选择起点，选择终点，构建直线；
	//2.直线与场景求交；
	//3.起-交（绿色直线），交-终（红色直线）;
	//
	VisibilityAnalysis(handler, viewer) {

		//变量
		let positions = [];
		let floatingPoint;
		let entity;
		let layerId = "visibilityLayer";

		//鼠标左键事件（创建点）
		handler.setInputAction(event => {
			let position = event.position;
			if (!Cesium.defined(position)) return;

			let ray = viewer.camera.getPickRay(position);
			if (!Cesium.defined(ray)) return;

			let cartesian = viewer.scene.globe.pick(ray, viewer.scene);
			if (!Cesium.defined(cartesian)) return;

			let num = positions.length;

			if (num === 0) {
				// * 这里是创建一个跟随鼠标实时移动的点去绘制面
				positions.push(cartesian);
				floatingPoint = this.createPoint1(cartesian, viewer, layerId);
				entity = this.showPolyline2Map(viewer, positions, entity, layerId);
				positions.push(cartesian);
				this.createPoint1(cartesian, viewer, layerId);
			} else {
				positions.push(cartesian);
				this.createPoint1(cartesian, viewer, layerId);

				viewer.entities.remove(floatingPoint);
				handler.destroy();
				handler = null;
				this.analysisVisible(positions, viewer, entity);
			}
		}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

		//鼠标移动事件（动态拉线）
		handler.setInputAction(event => {
			let position = event.endPosition;
			if (!Cesium.defined(position)) return;

			if (positions.length < 1) {
				return;
			}

			let ray = viewer.camera.getPickRay(position);
			if (!Cesium.defined(ray)) return;

			let cartesian = viewer.scene.globe.pick(ray, viewer.scene);
			if (!Cesium.defined(cartesian)) return;

			floatingPoint.position.setValue(cartesian);
			positions.pop();
			positions.push(cartesian);

		}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
	}

	//通视分析
	analysisVisible(positions, viewer, entity) {
		viewer.entities.remove(entity);
		// 计算射线的方向
		let direction = Cesium.Cartesian3.normalize(
			Cesium.Cartesian3.subtract(
				positions[1],
				positions[0],
				new Cesium.Cartesian3()
			),
			new Cesium.Cartesian3()
		);
		// 建立射线
		let ray = new Cesium.Ray(positions[0], direction);
		let result = viewer.scene.globe.pick(ray, viewer.scene); // 计算交互点，返回第一个

		if (result !== undefined && result !== null) {
			this.drawLine(result, positions[0], Cesium.Color.GREEN, viewer); // 可视区域
			this.drawLine(result, positions[1], Cesium.Color.RED, viewer); // 不可视区域
		} else {
			this.drawLine(positions[0], positions[1], Cesium.Color.GREEN, viewer);
		}
	}

	// * 创建点实体
	createPoint1(cartesian, viewer, layerId) {
		let point = viewer.entities.add({
			name: layerId,
			position: cartesian,
			billboard: {
				heightReference: Cesium.HeightReference.NONE
			}
		});
		return point;
	}

	//绘制直线
	drawLine(leftPoint, secPoint, color, viewer) {
		viewer.entities.add({
			polyline: {
				positions: [leftPoint, secPoint],
				width: 5,
				material: color,
				depthFailMaterial: color
			}
		});
	}

	//动态绘制线
	showPolyline2Map(viewer, positions, entity, layerId) {
		let material = new Cesium.PolylineGlowMaterialProperty({
			color: Cesium.Color.BLUE.withAlpha(0.5)
		});

		let dynamicPositions = new Cesium.CallbackProperty(() => {
			return positions;
		}, false);

		let num = positions.length,
			last = positions[num - 1];
		let bData = {
			name: layerId,
			position: last,
			polyline: {
				positions: dynamicPositions,
				clampToGround: false,
				width: 8,
				material: material
			}
		};

		entity = viewer.entities.add(bData);
		console.log(entity);
		return entity
	}


	/********** 辅助工具专题 **********/
	//双屏比对
	createDbScreen(imgLayer, viewer, el) {
		imgLayer.splitDirection = new Cesium.ImagerySplitDirection.LEFT;
		viewer.scene.imagerySplitPosition = el.offsetLeft / el.parentElement.offsetWidth;
		let handler = new Cesium.ScreenSpaceEventHandler(el);

		handler.setInputAction(() => {
		}, Cesium.ScreenSpaceEventType.LEFT_DOWN);

		handler.setInputAction(() => {
		}, Cesium.ScreenSpaceEventType.PINCH_START);

		handler.setInputAction(this.move, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
		handler.setInputAction(this.move, Cesium.ScreenSpaceEventType.PINCH_MOVE);

		handler.setInputAction(()=> {
		}, Cesium.ScreenSpaceEventType.LEFT_UP);

		handler.setInputAction(()=> {
		}, Cesium.ScreenSpaceEventType.PINCH_END);
	}

	move(movement, el, viewer) {
		let relativeOffset = movement.endPosition.x;
		let splitPosition = (el.offsetLeft + relativeOffset) / el.parentElement.offsetWidth;
		el.style.left = 100.0 * splitPosition + "%";
		viewer.scene.imagerySplitPosition = splitPosition;
	}

}