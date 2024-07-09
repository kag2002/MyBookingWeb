﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using BookingWeb.DbEntities;
using BookingWeb.Modules.LienHes.Dto;
using Microsoft.AspNetCore.Http;

namespace BookingWeb.Modules.LienHes
{
    public class LienHeAppService : BookingWebAppServiceBase
    {
        private readonly IRepository<LienHe> _lienHe;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public LienHeAppService(IRepository<LienHe> lienHe, IHttpContextAccessor httpContextAccessor)
        {
            _lienHe = lienHe;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<List<DanhSachOutputDto>> GetDanhSachLienHe()
        {
            try
            {
                var lst = await _lienHe.GetAllListAsync();

                var dto = lst.OrderByDescending(e => e.CreationTime) // Sort by CreationTime
                    .Select(e => new DanhSachOutputDto
                    {
                        Id = e.Id,
                        HoTen = e.HoTen,
                        Email = e.Email,
                        PhoneNumber = e.PhoneNumber,
                        NoiDung = e.NoiDung,
                        UserId = e.CreatorUserId,
                        CreationDate = e.CreationTime.ToString("dd/MM/yyyy") // Format the date
                    })
                    .ToList();

                return dto;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<List<DanhSachOutputDto>> GetDanhSachLienHeByUserId(int userId)
        {
            try
            {
                if (userId == 0)
                {
                    throw new Exception($"{userId} is invalid!");
                }

                var lst = await _lienHe.GetAllListAsync();

                var dto = lst.Where(p => p.CreatorUserId == userId)
                    .OrderByDescending(e => e.CreationTime) // Sort by CreationTime
                    .Select(e => new DanhSachOutputDto
                    {
                        Id = e.Id,
                        HoTen = e.HoTen,
                        Email = e.Email,
                        PhoneNumber = e.PhoneNumber,
                        NoiDung = e.NoiDung,
                        UserId = e.CreatorUserId,
                        CreationDate = e.CreationTime.ToString("dd/MM/yyyy") // Format the date
                    })
                    .ToList();

                return dto;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> ClientSendToMessage(MessageDto input)
        {
            try
            {
                var message = new LienHe
                {
                    HoTen = input.Hoten,
                    Email = input.Email,
                    PhoneNumber = input.PhoneNumber,
                    NoiDung = input.NoiDung
                };

                await _lienHe.InsertAsync(message);

                using (var smtpClient = new SmtpClient("smtp.gmail.com")) // Change to Gmail's SMTP server
                {
                    smtpClient.Port = 587;
                    smtpClient.Credentials = new NetworkCredential("lethienkhang2002@gmail.com", "hfkinaalbpwwrebr"); // Use your email and app password
                    smtpClient.EnableSsl = true;

                    var mailMessage = new MailMessage();
                    mailMessage.From = new MailAddress("lethienkhang2002@gmail.com", "BookingWeb.com"); // Use your email
                    mailMessage.To.Add(input.Email);
                    mailMessage.Subject = "Hello " + input.Hoten + ","; // Chủ đề của mail
                    mailMessage.Body = "Thank you!"; // nội dung email
                    mailMessage.IsBodyHtml = true;

                    await smtpClient.SendMailAsync(mailMessage);
                }

                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

     
        public async Task<bool> ServerSendToMailClient(MailDto input)
        {
            try
            {
                using (var smtpClient = new SmtpClient("smtp.gmail.com")) // Change to Gmail's SMTP server
                {
                    smtpClient.Port = 587;
                    smtpClient.Credentials = new NetworkCredential("your_email", "your_app_password"); // Use your email and app password
                    smtpClient.EnableSsl = true;

                    var mailMessage = new MailMessage();
                    mailMessage.From = new MailAddress("your_email", "BookingWeb.com"); // Use your email
                    mailMessage.To.Add(input.Email);
                    mailMessage.Subject = "Hello " + input.HoTen + ","; // Chủ đề của mail
                    mailMessage.Body = "Thank you!"; // nội dung email
                    mailMessage.IsBodyHtml = true;

                    await smtpClient.SendMailAsync(mailMessage);

                    return true;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
