// Avatar3D.jsx
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function AvatarModel(props) {
  const { scene } = useGLTF("/models/avatar.glb"); // <-- Your 3D model path
  return <primitive object={scene} {...props} />;
}

export default function Avatar3D() {
  return (
    <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
      <Canvas camera={{ position: [0, 0, 2.5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} />
        <Suspense fallback={null}>
          <AvatarModel scale={1.2} />
        </Suspense>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
      </Canvas>
    </div>
  );
}
