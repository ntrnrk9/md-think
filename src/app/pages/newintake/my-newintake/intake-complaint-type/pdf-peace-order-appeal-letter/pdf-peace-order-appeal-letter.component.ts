import { Component, OnInit, Input } from '@angular/core';
import { InvolvedPerson } from '../../_entities/newintakeModel';
import { General, EvaluationFields } from '../../_entities/newintakeSaveModel';

@Component({
  selector: 'pdf-peace-order-appeal-letter',
  templateUrl: './pdf-peace-order-appeal-letter.component.html',
  styleUrls: ['./pdf-peace-order-appeal-letter.component.scss']
})
export class PdfPeaceOrderAppealLetterComponent implements OnInit {

  @Input() persons: InvolvedPerson[];
  @Input() general: General;
  @Input() evalFields: EvaluationFields;

  constructor() { }

  ngOnInit() {
  }

  getPerson(Role: string): InvolvedPerson {
      if (this.persons) {
          return this.persons.find(person => person.Role === Role);
      }
      return null;
  }

  getVictimName() {
      const person = this.getPerson('Alleged Victim');
        if (person) {
            return person.fullName;
        }
      return '';
    }

    getVictimAddress () {
      const person = this.getPerson('Alleged Victim');
        if (person) {
            return person.fullAddress;
        }
      return '';
    }

    getMaltreatorName() {
      const person = this.getPerson('Alleged Maltreator');
      if (person) {
          return person.fullName;
      }
    return '';
    }

    getMaltreatorAddress () {
      const person = this.getPerson('Alleged Maltreator');
        if (person) {
            return person.fullAddress;
        }
      return '';
    }

    getAllegedOffenceDate () {
      if (this.evalFields) {
        return this.evalFields.allegedoffensedate;
      }
    }

    getPersonID(role) {
      const person = this.getPerson(role);
      if (person) {
          return person.Pid.substr(person.Pid.length - 8).toUpperCase();
      }
    return '';
    }

    appointmentDate() {
      const RecivedDate =  new Date(this.general.RecivedDate);
      return RecivedDate.setDate(RecivedDate.getDate() + 7);
    }


}
