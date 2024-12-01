import * as THREE from "three";
import CLOUDS from "vanta/dist/vanta.clouds.min";

export const CloudBackground = () => {
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);

  useEffect(() => {
    if (!vantaEffect.current) {
      vantaEffect.current = CLOUDS({
        el: vantaRef.current,
        THREE,
        skyColor: 0xbfd8ff,
        cloudColor: 0xffffff,
        speed: 1.5,
      });
    }

    return () => {
      if (vantaEffect.current) vantaEffect.current.destroy();
    };
  }, []);

  return <div ref={vantaRef} style={{ height: "100vh", width: "100%" }} />;
};


