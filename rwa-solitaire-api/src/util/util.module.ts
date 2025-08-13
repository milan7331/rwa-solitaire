import { Module } from "@nestjs/common";
import { DateCalculationService } from "./date-calculation.service";

@Module({
    imports: [],
    providers: [DateCalculationService],
    exports: [DateCalculationService]
})
export class UtilModule {}