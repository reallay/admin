import {Component, OnInit} from '@angular/core';
import {CateMService} from '../../../service/cateM/cate-m.service';
import {NzMessageService} from 'ng-zorro-antd';
import {LabelMService} from '../../../service/labelM/label-m.service';
import {CompanyMService} from '../../../service/companyM/company-m.service';
import {PositionMService} from '../../../service/positionM/position-m.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ages} from '../../../mockData/age';

@Component({
  selector: 'app-edit-position',
  templateUrl: './edit-position.component.html',
  styleUrls: ['./edit-position.component.css']
})
export class EditPositionComponent implements OnInit {

  agesData: any = ages;
  positionId: any;
  companyName: any;
  editCompanyId: any;

  companyId: any;
  positionCateId: any;
  name: any = '';
  minPay: any = 0;
  maxPay: any = 0;
  minWorkExp: any = 0;
  maxWorkExp: any = 0;
  education: any = '不限';
  num: any = 0;
  age: any = 0;
  isSoldierPriority: any;
  // address: any = '';
  positionRequirement: any = '';
  isShow: any = 1;
  interviewTime: any;
  interviewTimeStamp: any;
  interviewAddress: any;
  unitPrice: any;
  endTime: any;
  endTimeStamp: any;
  positionType: any;

  companyList: any = [];

  // ueditor 配置
  neditorConfig = {
    'autoClearinitialContent': true,
    'initialFrameWidth': '100%',
    'initialFrameHeight': '300',
    'autoHeightEnabled': false,
    'zIndex': 0

  };


  // 职位类型
  nodes: any = [];
  values: any | null = null;
  // 职位类型结束


  //标签
  labels: any = [];
  selectedTags: any = [];
  selectedLabels: any = '';

  //标签结束


  constructor(
    private cateService: CateMService,
    private msg: NzMessageService,
    private labelService: LabelMService,
    private companyService: CompanyMService,
    private positionService: PositionMService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(
      params => {
        this.positionId = params.positionId;
        this.getPositionDetail();
      }
    );
    this.getAllByTree();
    this.getAllLabels();
    this.getAllCompany();
  }

  // 面试时间
  onInterviewTimeChange(result: Date): void {

    this.interviewTimeStamp = Math.round(result.getTime() / 1000).toString();
  }

  onInterviewTimeOk(result: Date): void {
    this.interviewTimeStamp = Math.round(result.getTime() / 1000).toString();
  }

  // 截止时间
  onEndTimeChange(result: Date): void {
    this.endTimeStamp = Math.round(result.getTime() / 1000).toString();
  }

  onEndTimeOk(result: Date): void {
    this.endTimeStamp = Math.round(result.getTime() / 1000).toString();
  }

  // 类型
  onChange($event: string): void {
    this.values = $event;
    const len = $event.length;
    this.positionCateId = $event[len - 1];
  }


  handleChange(checked: boolean, tag: string): void {
    if (checked) {
      this.selectedTags.push(tag);
    } else {
      this.selectedTags = this.selectedTags.filter(t => t !== tag);
    }

    // 选择的标签
    this.selectedLabels = this.selectedTags.join(',');

  }

  //
  getAllByTree(): void {
    this.cateService.getAllByTree(1).subscribe(
      res => {
        if (res.errorCode == 0) {
          this.nodes = res.data;
        } else {
          this.msg.warning(res.msg);
        }
      }, err => {
        this.msg.error('服务异常');
      }
    );
  }

  //get all labels
  getAllLabels(): void {
    this.labelService.getAllLabels().subscribe(
      res => {
        if (res.errorCode == 0) {
          this.labels = res.data.list;
        } else {
          this.msg.warning(res.msg);
        }
      }, err => {
        this.msg.error('服务异常');
      }
    );
  }

  // get all company
  getAllCompany(): void {
    this.companyService.getAllCompany().subscribe(
      res => {
        if (res.errorCode == 0) {
          this.companyList = res.data.list;
        } else {
          this.msg.warning(res.msg);
        }
      }, err => {
        this.msg.error('服务异常');
      }
    );
  }

  // 获取职位详情
  getPositionDetail(): void {
    this.positionService.getPositionDetail(this.positionId).subscribe(
      res => {
        if (res.errorCode == 0) {
          const detail = res.data.detail;
          this.positionCateId = detail.positionCateId;
          this.values = detail.positionCateName;
          this.companyId = detail.companyId;
          this.companyName = detail.companyName;
          this.name = detail.name;
          this.minPay = detail.minPay;
          this.maxPay = detail.maxPay;
          this.minWorkExp = detail.minWorkExp;
          this.maxWorkExp = detail.maxWorkExp;
          this.education = detail.education;
          this.num = detail.num;
          this.age = detail.age;
          this.isSoldierPriority = detail.isSoldierPriority;
          // this.address = detail.address;
          this.positionRequirement = detail.positionRequirement;
          this.interviewAddress = detail.interviewAddress;
          this.interviewTimeStamp = detail.interviewTime;
          this.endTimeStamp = detail.endTime;
          this.positionType = detail.positionType;
          this.unitPrice = detail.unitPrice;
          this.isShow = detail.isShow;
          this.selectedTags = detail.labelIds;
          this.selectedLabels = detail.labelIds.join(',');

        } else {
          this.msg.warning(res.msg);
        }
      }, err => {
        this.msg.error('服务异常');
      }
    );
  }

  // 编辑职位
  editPosition(): void {
    this.positionService.editPosition(this.positionId, this.positionCateId, this.name, this.companyId, this.minPay, this.maxPay, this.minWorkExp, this.maxWorkExp,
      this.education, this.age, this.num, this.selectedLabels, this.isSoldierPriority, this.positionRequirement,
      this.interviewTimeStamp, this.endTimeStamp, this.interviewAddress, this.unitPrice, this.positionType,
      this.isShow).subscribe(
      res => {
        if (res.errorCode == 0) {
          this.msg.success('编辑成功');
          this.router.navigateByUrl('/home/positionM');
        } else {
          this.msg.warning(res.msg);
        }
      }, err => {
        this.msg.error('服务异常');
      }
    );
  }


}
