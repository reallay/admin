import {Component, OnInit} from '@angular/core';
import {SlideMService} from '../../service/slideM/slide-m.service';
import {NzMessageService} from 'ng-zorro-antd';
import {Router} from '@angular/router';

@Component({
  selector: 'app-slide-m',
  templateUrl: './slide-m.component.html',
  styleUrls: ['./slide-m.component.css']
})
export class SlideMComponent implements OnInit {

  listOfData: any;

  constructor(
    public slideMService: SlideMService,
    private msg: NzMessageService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.getAllSlide();
  }

  getAllSlide(): void {

    this.slideMService.getAll().subscribe(
      res => {
        if (res.errorCode == 0) {
          this.listOfData = res.data.list;
        }
      },
      err => {
        this.msg.error('服务异常');
      }
    );
  }

  //删除轮播图
  delSlide(slideId): void {
    const idToken = window.localStorage.getItem('idToken');
    this.slideMService.delSlide(slideId, idToken).subscribe(
      res => {
        if (res.errorCode == 0) {
          this.msg.success('删除成功');
          this.router.navigateByUrl('/home/slideM');
          this.getAllSlide();
        } else {
          this.msg.warning(res.msg);
        }
      }, err => {
        this.msg.error('服务异常');
      }
    );
  }

}
