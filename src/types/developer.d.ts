declare global {
  type DevStore = {
    developers: Developer[];
  };

  type Developer = {
    id: string;
    name: string;
    isJunior: boolean;
    frameworks: Framework[];
  };

  type Framework = {
    name: string;
  };
}

export {};
