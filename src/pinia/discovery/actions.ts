import { Getters } from "./getters";
import { State } from "./state";

export interface Actions extends State, Getters {}
