import { Camera, EventDispatcher, Vector3, Vector2, Quaternion } from 'three';

// Original code from three/examples/js/controls/trackballcontrols.js

const STATE = {
    NONE: -1,
    ROTATE: 0,
};

export class TrackballControls extends EventDispatcher {

    public enabled: boolean = true;
    public screen: { left: number; top: number; width: number; height: number } = {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
    };
    public rotateSpeed: number;
    public noRotate: boolean;
    public staticMoving: boolean;
    public dynamicDampingFactor: number;
    public minDistance: number;
    public maxDistance: number;
    public keys: number[];

    private target: Vector3;
    private position0: Vector3;
    private target0: Vector3;
    private up0: Vector3;

    private EPS = 0.000001;

    private lastPosition = new Vector3();

    private state = STATE.NONE;
    private prevState = STATE.NONE;

    private eye = new Vector3();

    private movePrev = new Vector2();
    private moveCurr = new Vector2();

    private lastAxis = new Vector3();
    private lastAngle = 0;

    private changeEvent = {
        type: 'change',
    };

    private startEvent = {
        type: 'start',
    };

    private endEvent = {
        type: 'end',
    };

    private mouseOnScreenVector = new Vector2();
    private mouseOnCircleVector = new Vector2();

    // properties of rotateCamera()
    private axis = new Vector3();
    private quaternion = new Quaternion();
    private eyeDirection = new Vector3();
    private objectUpDirection = new Vector3();
    private objectSidewaysDirection = new Vector3();
    private moveDirection = new Vector3();
    private angle: number = 0;


    constructor(private object: Camera, private domElement: HTMLElement | Document = document) {
        super();

        this.rotateSpeed = 1.0;
        this.noRotate = false;

        this.staticMoving = false;
        this.dynamicDampingFactor = 0.2;

        this.minDistance = 0;
        this.maxDistance = Infinity;

        this.keys = [65 /*A*/, 83 /*S*/, 68 /*D*/];

        this.target = new Vector3();

        // for reset
        this.target0 = this.target.clone();
        this.position0 = this.object.position.clone();
        this.up0 = this.object.up.clone();

        this.activate();

        this.handleResize();

        // force an update at start
        this.update();
    }

    public activate() {
        (this.domElement as HTMLElement).addEventListener('contextmenu', this.contextmenu.bind(this), false);
        (this.domElement as HTMLElement).addEventListener('mousedown', this.mousedown.bind(this), false);
    }

    public deactivate() {
        (this.domElement as HTMLElement).removeEventListener('contextmenu', this.contextmenu, false);
        (this.domElement as HTMLElement).removeEventListener('mousedown', this.mousedown, false);

        document.removeEventListener('mousemove', this.mousemove, false);
        document.removeEventListener('mouseup', this.mouseup, false);
    }

    public update(): void {
        this.eye.subVectors(this.object.position, this.target);

        if (!this.noRotate) {
            this.rotateCamera();
        }

        this.object.position.addVectors(this.target, this.eye);

        this.object.lookAt(this.target);

        if (this.lastPosition.distanceToSquared(this.object.position) > this.EPS) {
            this.dispatchEvent.call(this.domElement, [this.changeEvent]);
            this.lastPosition.copy(this.object.position);
        }
    }

    public reset(): void {
        this.state = STATE.NONE;
        this.prevState = STATE.NONE;

        this.target.copy(this.target0);
        this.object.position.copy(this.position0);
        this.object.up.copy(this.up0);

        this.eye.subVectors(this.object.position, this.target);

        this.object.lookAt(this.target);

        this.dispatchEvent.call(this.domElement, [this.changeEvent]);

        this.lastPosition.copy(this.object.position);
    }

    public dispose(): void {
        this.deactivate();
    }

    public rotateCamera(): void {
        this.moveDirection.set(this.moveCurr.x - this.movePrev.x, this.moveCurr.y - this.movePrev.y, 0);
        this.angle = this.moveDirection.length();

        if (this.angle) {
            this.eye.copy(this.object.position).sub(this.target);

            this.eyeDirection.copy(this.eye).normalize();
            this.objectUpDirection.copy(this.object.up).normalize();
            this.objectSidewaysDirection.crossVectors(this.objectUpDirection, this.eyeDirection).normalize();

            this.objectUpDirection.setLength(this.moveCurr.y - this.movePrev.y);
            this.objectSidewaysDirection.setLength(this.moveCurr.x - this.movePrev.x);

            this.moveDirection.copy(this.objectUpDirection.add(this.objectSidewaysDirection));

            this.axis.crossVectors(this.moveDirection, this.eye).normalize();

            this.angle *= this.rotateSpeed;
            this.quaternion.setFromAxisAngle(this.axis, this.angle);

            this.eye.applyQuaternion(this.quaternion);
            this.object.up.applyQuaternion(this.quaternion);

            this.lastAxis.copy(this.axis);
            this.lastAngle = this.angle;

        } else if (!this.staticMoving && this.lastAngle) {
            this.lastAngle *= Math.sqrt(1.0 - this.dynamicDampingFactor);
            this.eye.copy(this.object.position).sub(this.target);
            this.quaternion.setFromAxisAngle(this.lastAxis, this.lastAngle);
            this.eye.applyQuaternion(this.quaternion);
            this.object.up.applyQuaternion(this.quaternion);

        }

        this.movePrev.copy(this.moveCurr);
    }

    public handleResize(): void {
        if (this.domElement instanceof Document) {
            this.screen.left = 0;
            this.screen.top = 0;
            this.screen.width = window.innerWidth;
            this.screen.height = window.innerHeight;

        } else {
            const box = this.domElement.getBoundingClientRect();
            // adjustments come from similar code in the jquery offset() function
            const d = this.domElement.ownerDocument.documentElement;
            this.screen.left = box.left + window.pageXOffset - d.clientLeft;
            this.screen.top = box.top + window.pageYOffset - d.clientTop;
            this.screen.width = box.width;
            this.screen.height = box.height;
        }
    }

    public handleEvent(event: any): void {
        throw new Error('handleEvent not implemented');
    }

    private getMouseOnCircle(pageX: number, pageY: number) {
        this.mouseOnCircleVector.set(
            ((pageX - this.screen.width * 0.5 - this.screen.left) / (this.screen.width * 0.5)),
            ((this.screen.height + 2 * (this.screen.top - pageY)) / this.screen.width), // screen.width intentional
        );

        return this.mouseOnCircleVector;
    }

    private mousedown(event: MouseEvent) {

        if (this.enabled === false) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        if (this.state === STATE.NONE) {

            this.state = event.button;

        }

        if (this.state === STATE.ROTATE && !this.noRotate) {
            this.moveCurr.copy(this.getMouseOnCircle(event.pageX, event.pageY));
            this.movePrev.copy(this.moveCurr);

        }

        document.addEventListener('mousemove', this.mousemove.bind(this), false);
        document.addEventListener('mouseup', this.mouseup.bind(this), false);

        this.dispatchEvent.call(this.domElement, [this.startEvent]);

    }

    private mousemove(event: MouseEvent) {
        if (this.enabled === false) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        if (this.state === STATE.ROTATE && !this.noRotate) {
            this.movePrev.copy(this.moveCurr);
            this.moveCurr.copy(this.getMouseOnCircle(event.pageX, event.pageY));

        }
    }

    private mouseup(event: MouseEvent) {
        if (this.enabled === false) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        this.state = STATE.NONE;

        document.removeEventListener('mousemove', this.mousemove);
        document.removeEventListener('mouseup', this.mouseup);
        this.dispatchEvent.call(this.domElement, [this.endEvent]);
    }

    private contextmenu(event: Event) {
        if (this.enabled === false) {
            return;
        }

        event.preventDefault();
    }
}
