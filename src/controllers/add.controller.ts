import { Request, Response } from "express";
import AddService from "../services/add.service";

class AddController {
  private addService;

  constructor() {
    this.addService = new AddService();
  }

  public add = (req: Request, res: Response): void => {
    const { num1, num2 } = req.body;
    const positiveNumberRegex = /^[1-9]\d*$/;

    if (!positiveNumberRegex.test(num1) || !positiveNumberRegex.test(num2)) {
      res.status(400).json({ error: "Invalid input. Please provide positive numbers." });
      return;
    }

    const result = this.addService.performAddition(num1, num2);

    res.json(result);
  }

  public saveSteps = async (req: Request, res: Response): Promise<void> => {
    const { num1, num2, steps } = req.body;

    const positiveNumberRegex = /^[1-9]\d*$/;

    if (!positiveNumberRegex.test(num1) || !positiveNumberRegex.test(num2)) {
      res.status(400).json({ error: "Invalid input. Please provide positive numbers." });
      return;
    }

    if (typeof steps !== "object" || steps.length === 0) {
      res.status(400).json({ error: "Invalid input. Please provide non-empty steps array." });
      return;
    }

    try {
      await this.addService.saveStepsToDB(num1, num2, steps);
      res.json({ message: "Steps saved successfully." });
    } catch (error) {
      res.status(500).json({ error: "An error occurred while saving the steps." });
    }
  }
}

export default AddController;
