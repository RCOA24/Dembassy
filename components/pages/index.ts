import type { ComponentType } from "react";
import About from "./About";
import Appointment from "./Appointment";
import Careers from "./Careers";
import Contact from "./Contact";
import Services from "./Services";

export const pageComponents: Record<string, ComponentType> = {
  about: About,
  appointment: Appointment,
  careers: Careers,
  contact: Contact,
  services: Services,
};
