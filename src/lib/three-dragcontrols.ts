import {
    EventDispatcher,
    Plane,
    Raycaster,
    Vector2,
    Vector3,
    Object3D,
    Camera,
    Event,
} from 'three';

// Original code from three/examples/js/controls/dragcontrol.js

/*
 * @author zz85 / https://github.com/zz85
 * @author mrdoob / http://mrdoob.com
 * Running this will allow you to drag three.js objects around the screen.
 */

export class DragControls extends EventDispatcher {

    public enabled = true;

    private plane = new Plane();
    private raycaster = new Raycaster();

    private mouse = new Vector2();
    private offset = new Vector3();
    private intersection = new Vector3();

    private selected: Object3D | null = null;
    private hovered: Object3D | null = null;

    constructor(private objects: Object3D[], private camera: Camera, private domElement: HTMLElement) {
        super();
        this.activate();
    }

    public activate() {
        this.domElement.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
        this.domElement.addEventListener('mousedown', this.onDocumentMouseDown.bind(this), false);
        this.domElement.addEventListener('mouseup', this.onDocumentMouseCancel.bind(this), false);
        this.domElement.addEventListener('mouseleave', this.onDocumentMouseCancel.bind(this), false);
        this.domElement.addEventListener('touchmove', this.onDocumentTouchMove.bind(this), false);
        this.domElement.addEventListener('touchstart', this.onDocumentTouchStart.bind(this), false);
        this.domElement.addEventListener('touchend', this.onDocumentTouchEnd.bind(this), false);
    }

    public deactivate() {
        this.domElement.removeEventListener('mousemove', this.onDocumentMouseMove, false);
        this.domElement.removeEventListener('mousedown', this.onDocumentMouseDown, false);
        this.domElement.removeEventListener('mouseup', this.onDocumentMouseCancel, false);
        this.domElement.removeEventListener('mouseleave', this.onDocumentMouseCancel, false);
        this.domElement.removeEventListener('touchmove', this.onDocumentTouchMove, false);
        this.domElement.removeEventListener('touchstart', this.onDocumentTouchStart, false);
        this.domElement.removeEventListener('touchend', this.onDocumentTouchEnd, false);
    }

    public dispose() {
        this.deactivate();
    }

    /**
     * @deprecated setObjects() has been removed.
     */
    public setObjects() {
        // tslint:disable-next-line:no-console
        console.error('THREE.DragControls: setObjects() has been removed.');
    }

    /**
     * @deprecated on() has been deprecated. Use addEventListener() instead.
     */
    public on(type: string, listener: (event: Event) => void) {
        // tslint:disable-next-line:no-console
        console.warn('THREE.DragControls: on() has been deprecated. Use addEventListener() instead.');
        this.addEventListener(type, listener);

    }

    /**
     * @deprecated off() has been deprecated. Use removeEventListener() instead.
     */
    public off(type: string, listener: (event: Event) => void) {
        // tslint:disable-next-line:no-console
        console.warn('THREE.DragControls: off() has been deprecated. Use removeEventListener() instead.');
        this.removeEventListener(type, listener);

    }

    /**
     * @deprecated notify() has been deprecated. Use dispatchEvent() instead.
     */
    public notify(type: string) {
        // tslint:disable-next-line:no-console
        console.error('THREE.DragControls: notify() has been deprecated. Use dispatchEvent() instead.');
        this.dispatchEvent.call(this.domElement, [{
            type,
        }]);
    }

    private onDocumentMouseMove(event: MouseEvent) {

        event.preventDefault();

        const rect = this.domElement.getBoundingClientRect();

        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        if (this.selected && this.enabled) {
            if (this.raycaster.ray.intersectPlane(this.plane, this.intersection)) {
                this.selected.position.copy(this.intersection.sub(this.offset));
            }

            this.dispatchEvent.call(this.domElement, [{
                type: 'drag',
                object: this.selected,
            }]);
            return;
        }

        this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersects = this.raycaster.intersectObjects(this.objects);

        if (intersects.length > 0) {
            const object = intersects[0].object;

            this.plane.setFromNormalAndCoplanarPoint(this.camera.getWorldDirection(this.plane.normal), object.position);

            if (this.hovered !== object) {
                this.dispatchEvent.call(this.domElement, [{
                    type: 'hoveron',
                    object,
                }]);
                this.domElement.style.cursor = 'pointer';
                this.hovered = object;
            }

        } else {
            if (this.hovered !== null) {
                this.dispatchEvent.call(this.domElement, [{
                    type: 'hoveroff',
                    object: this.hovered,
                }]);
                this.domElement.style.cursor = 'auto';
                this.hovered = null;
            }
        }
    }

    private onDocumentMouseDown(event: MouseEvent) {
        event.preventDefault();

        this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersects = this.raycaster.intersectObjects(this.objects);

        if (intersects.length > 0) {
            this.selected = intersects[0].object;

            if (this.raycaster.ray.intersectPlane(this.plane, this.intersection)) {
                this.offset.copy(this.intersection).sub(this.selected.position);
            }

            this.domElement.style.cursor = 'move';

            this.dispatchEvent.call(this.domElement, [{
                type: 'dragstart',
                object: this.selected,
            }]);
        }
    }

    private onDocumentMouseCancel(event: MouseEvent) {
        event.preventDefault();

        if (this.selected) {
            this.dispatchEvent.call(this.domElement, [{
                type: 'dragend',
                object: this.selected,
            }]);
            this.selected = null;
        }
        this.domElement.style.cursor = 'auto';
    }

    private onDocumentTouchMove(event: TouchEvent) {
        event.preventDefault();
        const touch: Touch = event.changedTouches[0];

        const rect = this.domElement.getBoundingClientRect();

        this.mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        if (this.selected && this.enabled) {
            if (this.raycaster.ray.intersectPlane(this.plane, this.intersection)) {
                this.selected.position.copy(this.intersection.sub(this.offset));
            }
            this.dispatchEvent.call(this.domElement, [{
                type: 'drag',
                object: this.selected,
            }]);
            return;
        }
    }

    private onDocumentTouchStart(event: TouchEvent) {
        event.preventDefault();
        const touch = event.changedTouches[0];

        const rect = this.domElement.getBoundingClientRect();

        this.mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersects = this.raycaster.intersectObjects(this.objects);

        if (intersects.length > 0) {
            this.selected = intersects[0].object;

            this.plane.setFromNormalAndCoplanarPoint(
                this.camera.getWorldDirection(this.plane.normal),
                this.selected.position,
            );

            if (this.raycaster.ray.intersectPlane(this.plane, this.intersection)) {

                this.offset.copy(this.intersection).sub(this.selected.position);

            }

            this.domElement.style.cursor = 'move';

            this.dispatchEvent.call(this.domElement, [{
                type: 'dragstart',
                object: this.selected,
            }]);
        }
    }

    private onDocumentTouchEnd(event: TouchEvent) {
        event.preventDefault();

        if (this.selected) {
            this.dispatchEvent.call(this.domElement, [{
                type: 'dragend',
                object: this.selected,
            }]);

            this.selected = null;
        }

        this.domElement.style.cursor = 'auto';
    }

}
